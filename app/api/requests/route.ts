import { NextRequest, NextResponse } from "next/server";
import { uuidv7 } from "uuidv7";
import { getDatabase } from "@/lib/mongodb";
import { createRequestSchema } from "./schema";
import type {
    AnalysisRequestDocument,
    CreateRequestResponse,
    ErrorResponse,
} from "./type";

export async function POST(
    request: NextRequest,
): Promise<NextResponse<CreateRequestResponse | ErrorResponse>> {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Request body must be valid JSON" },
            { status: 400 },
        );
    }

    const parsed = createRequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error: "Validation failed",
                details: parsed.error.flatten().fieldErrors as Record<
                    string,
                    string[]
                >,
            },
            { status: 422 },
        );
    }

    const { source_url } = parsed.data;
    const document: AnalysisRequestDocument = {
        _id: uuidv7(),
        source_url,
        created_at: new Date(),
    };

    try {
        const db = await getDatabase("sentional");
        await db
            .collection<AnalysisRequestDocument>("analysis_requests")
            .insertOne(document);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to save analysis request. Please try again." },
            { status: 500 },
        );
    }

    return NextResponse.json({ id: document._id }, { status: 201 });
}
