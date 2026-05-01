const T_CO_PATTERN = /https?:\/\/t\.co\/\S+/g;

function cleanText(text: string): string {
    return text
        .replace(T_CO_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

export interface CorePost {
    tweet_id: string;
    text: string;
    lang: string;
    created_at: string;
    views: string;
    favorites: number;
    retweets: number;
    replies: number;
    quotes: number;
    bookmarks: number;
    has_media: boolean;
    has_link: boolean;
    is_reply: boolean;
}

interface TweetSummary {
    id: string;
    text: string;
    lang: string;
    created_at: string;
    engagement: number;
    views: number;
    has_media: boolean;
    has_link: boolean;
    is_reply: boolean;
}

function summarizeTweet(post: CorePost): TweetSummary {
    return {
        id: post.tweet_id,
        text: cleanText(post.text),
        lang: post.lang,
        created_at: post.created_at,
        engagement:
            post.favorites +
            post.retweets +
            post.replies +
            post.quotes +
            post.bookmarks,
        views: parseInt(post.views, 10) || 0,
        has_media: post.has_media,
        has_link: post.has_link,
        is_reply: post.is_reply,
    };
}

export interface PromptParts {
    system: string;
    user: string;
}

export function buildAnalysisPrompt(
    screenName: string,
    posts: CorePost[],
): PromptParts {
    const system = `You are a social media intelligence analyst. Analyze the provided Twitter/X posts and return a structured JSON response covering sentiment, topics, and account_intelligence.

Base all findings strictly on the provided data. All tweet IDs referenced must exist in the input.

account_intelligence computation rules:
- posting_frequency.level: very_high ≥10/day, high 3–9/day, medium 1–2/day, low <1/day, irregular = no consistent pattern. Derive from date range and total post count.
- posting_frequency.summary: one factual sentence with real numbers (e.g. "18 posts over 6 days, avg 3/day").
- peak_activity: YYYY-MM-DD of the day with the most posts.
- engagement_breakdown: divide each metric total by post count, round to 2dp. total_engagement = raw sum of all metrics across all posts.
- top_post_id: tweet_id with highest (favorites+retweets+replies+quotes+bookmarks).
- media_usage_rate: (posts where has_media=true) / total × 100, rounded to 1dp.
- language_distribution: count by lang, sort descending, max 5 entries.
- content_style.format: link_sharing if >60% has_link=true, thread_focused if >60% is_reply=true, original_commentary if >60% standalone, otherwise mixed.
- content_style.description: 1–2 sentences on writing style, tone, and media/hashtag/emoji usage.
- audience_signals: 2–3 evidence-based sentences citing specific metric ratios and topic names. No generic labels.`;

    const summaries = posts.map(summarizeTweet);
    const totalEngagement = summaries.reduce((s, t) => s + t.engagement, 0);

    const user = `Analyze the following ${summaries.length} posts from Twitter/X account @${screenName}.

Total posts: ${summaries.length}
Total engagement: ${totalEngagement}
Date range: ${posts.at(-1)?.created_at ?? "unknown"} → ${posts.at(0)?.created_at ?? "unknown"}

Posts (JSON, newest first):
${JSON.stringify(summaries, null, 2)}

Return a structured analysis with sentiment, topics (max 10, ordered by frequency), and account_intelligence.`;

    return { system, user };
}
