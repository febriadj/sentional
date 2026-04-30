import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type {
    AnalysisApiResponse,
    AnalysisErrorResponse,
} from "@/app/api/analyses/type";
import { AccountHeader } from "./_components/account-header";
import { SentimentChart } from "./_components/sentiment-chart";
import { TopicsChart } from "./_components/topics-chart";
import { EngagementStats } from "./_components/engagement-stats";
import { IntelligencePanel } from "./_components/intelligence-panel";

interface Props {
    params: Promise<{ id: string }>;
}

async function fetchAnalysis(id: string): Promise<AnalysisApiResponse> {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/analyses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_request_id: id }),
        cache: "no-store",
    });

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        const err = (await res.json()) as AnalysisErrorResponse;
        throw new Error(err.error ?? "Analysis failed");
    }

    return res.json() as Promise<AnalysisApiResponse>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Account Analysis · ${id.slice(0, 8)}`,
    };
}

export default async function AnalysisPage({ params }: Props) {
    const { id } = await params;

    let data: AnalysisApiResponse;
    try {
        data = await fetchAnalysis(id);
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : "An unexpected error occurred.";
        return (
            <main className="bg-background flex min-h-screen items-center justify-center px-4">
                <div className="max-w-sm text-center">
                    <p className="text-destructive mb-1 text-sm font-medium">
                        Analysis Failed
                    </p>
                    <p className="text-muted-foreground text-sm">{message}</p>
                </div>
            </main>
        );
    }

    const { analysis_result, raw_posts } = data;
    const author = raw_posts[0]?.author;

    return (
        <main className="bg-background min-h-screen">
            <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
                {author && <AccountHeader author={author} />}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SentimentChart sentiment={analysis_result.sentiment} />
                    <TopicsChart topics={analysis_result.topics} />
                </div>

                <EngagementStats
                    breakdown={
                        analysis_result.account_intelligence
                            .engagement_breakdown
                    }
                />

                <IntelligencePanel
                    intelligence={analysis_result.account_intelligence}
                />
            </div>
        </main>
    );
}
