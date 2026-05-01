import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OpenRouter } from "@openrouter/sdk";
import { uuidv7 } from "uuidv7";
import { env } from "@/config/env";
import { getDatabase } from "@/lib/mongodb";
import { fetchUserPosts } from "./lib";
import { analysisResultSchema } from "./schema";
import { buildAnalysisPrompt } from "./prompt";
import type {
    AnalysisApiResponse,
    AnalysisDocument,
    AnalysisErrorResponse,
    TikHubTweet,
} from "./type";

const openrouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
    httpReferer: env.OPENROUTER_HTTP_REFERER,
});

export async function POST(
    request: NextRequest,
): Promise<NextResponse<AnalysisApiResponse | AnalysisErrorResponse>> {
    let analysisRequestId: string | undefined;
    try {
        const body = await request.json();
        analysisRequestId =
            typeof body?.analysis_request_id === "string"
                ? body.analysis_request_id
                : undefined;
    } catch {
        return NextResponse.json(
            { error: "Request body must be valid JSON" },
            { status: 400 },
        );
    }

    if (!analysisRequestId?.trim()) {
        return NextResponse.json(
            { error: "analysis_request_id is required" },
            { status: 400 },
        );
    }

    const db = await getDatabase("sentional");
    const analysisRequest = await db
        .collection<{ _id: string; source_url: string }>("analysis_requests")
        .findOne({ _id: analysisRequestId });

    if (!analysisRequest) {
        return NextResponse.json(
            { error: "Analysis request not found" },
            { status: 404 },
        );
    }

    let screenName: string;
    try {
        const parsed = new URL(
            analysisRequest.source_url.startsWith("http")
                ? analysisRequest.source_url
                : `https://${analysisRequest.source_url}`,
        );
        // pathname: "/@username" or "/username"
        screenName = parsed.pathname.replace(/^\/+@?/, "").split("/")[0];
        if (!screenName) throw new Error("empty screen_name");
    } catch {
        return NextResponse.json(
            { error: "Could not extract screen name from stored URL" },
            { status: 422 },
        );
    }

    const existing = await db
        .collection<AnalysisDocument>("analyses")
        .findOne({ analysis_request_id: analysisRequestId });

    if (existing) {
        // Re-fetch raw posts to return alongside cached result
        let rawPosts: TikHubTweet[] = [];
        rawPosts = await fetchUserPosts(screenName);
        return NextResponse.json({
            analysis_result: existing.analysis_result,
            raw_posts: rawPosts,
        });
    }

    let rawPosts: TikHubTweet[];
    try {
        rawPosts = await fetchUserPosts(screenName);
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { error: "Rate limit reached. Please retry in a few moments." },
                { status: 429 },
            );
        }
        return NextResponse.json(
            {
                error: "Failed to fetch posts from Twitter/X. Please try again.",
            },
            { status: 502 },
        );
    }

    if (rawPosts.length === 0) {
        return NextResponse.json(
            { error: "No posts found for this account." },
            { status: 404 },
        );
    }

    const { system, user } = buildAnalysisPrompt(screenName, rawPosts);

    let analysisResult: z.infer<typeof analysisResultSchema>;
    try {
        const jsonSchema = z.toJSONSchema(analysisResultSchema);

        const result = openrouter.callModel({
            model: "poolside/laguna-m.1:free",
            instructions: system,
            input: user,
            text: {
                format: {
                    type: "json_schema",
                    name: "analysis_result",
                    schema: jsonSchema as Record<string, unknown>,
                    strict: true,
                },
            },
        });

        const raw = await result.getText();
        analysisResult = analysisResultSchema.parse(JSON.parse(raw));
    } catch (err) {
        console.error("[POST /api/analyses] AI generation failed:", err);
        return NextResponse.json(
            { error: "Analysis generation failed. Please try again." },
            { status: 500 },
        );
    }

    const document: AnalysisDocument = {
        _id: uuidv7(),
        analysis_request_id: analysisRequestId,
        screen_name: screenName,
        analysis_result: analysisResult,
        created_at: new Date(),
    };

    try {
        await db.collection<AnalysisDocument>("analyses").insertOne(document);
    } catch (err) {
        // Non-fatal — log and continue; result is still returned to client
        console.error("[POST /api/analyses] MongoDB insert failed:", err);
    }

    return NextResponse.json({
        analysis_result: analysisResult,
        raw_posts: rawPosts,
    });
}
