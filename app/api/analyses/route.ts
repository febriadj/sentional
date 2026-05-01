import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uuidv7 } from "uuidv7";
import { env } from "@/config/env";
import redis, { Keys, TTL } from "@/lib/redis";
import { fetchUserPosts } from "./lib";
import { analysisResultSchema } from "./schema";
import { buildAnalysisPrompt } from "./prompt";
import type {
    AnalysisApiResponse,
    AnalysisDocument,
    AnalysisErrorResponse,
    TikHubTweet,
} from "./type";
import type { AnalysisRequestDocument } from "@/app/api/requests/type";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function streamOpenRouter(
    system: string,
    user: string,
    jsonSchema: Record<string, unknown>,
): Promise<string> {
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": env.OPENROUTER_HTTP_REFERER,
            "X-Title": env.OPENROUTER_APP_TITLE,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "poolside/laguna-m.1:free",
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
            stream: true,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "analysis_result",
                    schema: jsonSchema,
                    strict: true,
                },
            },
        }),
    });

    if (!response.ok || !response.body) {
        throw new Error(`OpenRouter error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (typeof delta === "string") accumulated += delta;
            } catch {
                // skip malformed SSE frames
                continue;
            }
        }
    }

    return accumulated;
}

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

    const analysisRequest = await redis.get<AnalysisRequestDocument>(
        Keys.analysisRequest(analysisRequestId),
    );

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

    const existing = await redis.get<AnalysisDocument>(
        Keys.analysis(analysisRequestId),
    );

    if (existing) {
        // Re-fetch raw posts to return alongside cached result
        const rawPosts = await fetchUserPosts(screenName);
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
        const jsonSchema = z.toJSONSchema(analysisResultSchema) as Record<
            string,
            unknown
        >;
        const raw = await streamOpenRouter(system, user, jsonSchema);
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
        await redis.set(Keys.analysis(analysisRequestId), document, {
            ex: TTL,
        });
    } catch (err) {
        // Non-fatal — log and continue; result is still returned to client
        console.error("[POST /api/analyses] Redis set failed:", err);
    }

    return NextResponse.json({
        analysis_result: analysisResult,
        raw_posts: rawPosts,
    });
}
