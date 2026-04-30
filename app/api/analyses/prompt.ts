import type { TikHubTweet } from "./type";

const T_CO_PATTERN = /https?:\/\/t\.co\/\S+/g;

function cleanText(text: string): string {
    return text
        .replace(T_CO_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

interface TweetSummary {
    id: string;
    text: string;
    lang: string;
    created_at: string;
    engagement: number;
    views: number;
    linked_domains: string[];
}

function summarizeTweet(tweet: TikHubTweet): TweetSummary {
    return {
        id: tweet.tweet_id,
        text: cleanText(tweet.text),
        lang: tweet.lang,
        created_at: tweet.created_at,
        engagement:
            tweet.favorites +
            tweet.retweets +
            tweet.replies +
            tweet.quotes +
            tweet.bookmarks,
        views: parseInt(tweet.views, 10) || 0,
        linked_domains: tweet.entities.urls
            .map((u) => {
                try {
                    return new URL(u.expanded_url).hostname;
                } catch {
                    return u.display_url;
                }
            })
            .filter(Boolean),
    };
}

export interface PromptParts {
    system: string;
    user: string;
}

export function buildAnalysisPrompt(
    screenName: string,
    tweets: TikHubTweet[],
): PromptParts {
    const system = `You are an expert social media analyst specializing in Twitter/X account intelligence.

Your task is to analyze a batch of posts from a single account and produce a structured analysis covering:
1. Sentiment Analysis — the emotional tone across the account's content
2. Topic Modeling — the recurring themes and subjects
3. Account Intelligence — behavioral patterns, engagement metrics, and audience signals

Be precise and data-driven. Base all findings strictly on the provided posts.
Do not speculate about information not present in the data.
All tweet IDs you reference must exist in the input data.

Rules for account_intelligence fields:
- posting_frequency.level: categorize as very_high (10+/day), high (3–9/day), medium (1–2/day), low (<1/day), or irregular (no consistent pattern). Derive from the date range and total post count.
- posting_frequency.summary: factual sentence using real numbers, e.g. "18 posts over 6 days, avg 3 posts/day".
- peak_activity: ISO 8601 date (YYYY-MM-DD) of the day with the most posts.
- engagement_breakdown: compute avg_likes, avg_retweets, avg_replies, avg_bookmarks, avg_views by dividing each metric total by the number of posts. Round to 2 decimal places. total_engagement is the raw sum of all metrics across all posts.
- top_post_id: tweet_id of the post with the highest combined engagement (favorites + retweets + replies + quotes + bookmarks).
- media_usage_rate: (posts with at least one photo) / (total posts) × 100, rounded to 1 decimal place.
- language_distribution: count posts by lang field (ISO 639-1 language code), sort descending, include up to 5 entries.
- content_style.format: choose link_sharing if >60% of posts share external URLs, original_commentary if >60% are self-contained, thread_focused if most posts are conversation replies, otherwise mixed.
- content_style.description: 1-2 sentences about writing style, typical structure, and tone. Reference sentence length, use of media, hashtag/emoji usage.
- audience_signals: 2-3 specific, evidence-based sentences. Cite actual metric ratios (e.g. bookmark-to-retweet ratio, which topics outperform). Never use labels like "developer_focused" or "tech_community". Reference concrete numbers or topic names from the data.`;

    const summaries = tweets.map(summarizeTweet);
    const totalEngagement = summaries.reduce((s, t) => s + t.engagement, 0);

    const user = `Analyze the following ${summaries.length} posts from Twitter/X account @${screenName}.

Total posts provided: ${summaries.length}
Total engagement across all posts: ${totalEngagement}
Date range: ${tweets.at(-1)?.created_at ?? "unknown"} → ${tweets.at(0)?.created_at ?? "unknown"}

Posts (JSON array, sorted newest first):
${JSON.stringify(summaries, null, 2)}

Return a structured analysis with sentiment, topics (max 10, ordered by frequency), and account_intelligence.`;

    return { system, user };
}
