import { z } from "zod";

export const sentimentSchema = z.object({
    overall: z
        .enum(["positive", "neutral", "negative"])
        .describe("The dominant overall sentiment across all posts"),
    score: z
        .number()
        .min(-1)
        .max(1)
        .describe(
            "Aggregate sentiment score from -1.0 (very negative) to 1.0 (very positive)",
        ),
    distribution: z
        .object({
            positive: z
                .number()
                .min(0)
                .max(100)
                .describe("Percentage of positive posts"),
            neutral: z
                .number()
                .min(0)
                .max(100)
                .describe("Percentage of neutral posts"),
            negative: z
                .number()
                .min(0)
                .max(100)
                .describe("Percentage of negative posts"),
        })
        .describe("Percentage breakdown of sentiment (must sum to 100)"),
    summary: z
        .string()
        .describe(
            "A 1-2 sentence plain-language summary of the account's emotional tone",
        ),
});

export const topicSchema = z.object({
    name: z.string().describe("Short, human-readable topic label (3-6 words)"),
    frequency: z
        .number()
        .int()
        .min(1)
        .describe("Number of posts related to this topic"),
    representative_tweet_ids: z
        .array(z.string())
        .max(3)
        .describe("Up to 3 tweet_ids that best illustrate this topic"),
});

export const accountIntelligenceSchema = z.object({
    posting_frequency: z
        .object({
            level: z
                .enum(["very_high", "high", "medium", "low", "irregular"])
                .describe(
                    "Categorical cadence: very_high (10+/day), high (3–9/day), medium (1–2/day), low (<1/day), irregular (erratic pattern)",
                ),
            summary: z
                .string()
                .describe(
                    "Factual sentence using real numbers from the data, e.g. '18 posts over 6 days, avg 3 posts/day'",
                ),
        })
        .describe(
            "Structured posting cadence with categorical level and descriptive summary",
        ),

    peak_activity: z
        .string()
        .describe(
            "ISO 8601 date (YYYY-MM-DD) of the single day with the highest number of posts in the dataset",
        ),

    engagement_breakdown: z
        .object({
            avg_likes: z.number().min(0).describe("Mean likes per post"),
            avg_retweets: z.number().min(0).describe("Mean retweets per post"),
            avg_replies: z.number().min(0).describe("Mean replies per post"),
            avg_bookmarks: z
                .number()
                .min(0)
                .describe("Mean bookmarks per post"),
            avg_views: z
                .number()
                .min(0)
                .describe("Mean views per post (parse views string to number)"),
            total_engagement: z
                .number()
                .min(0)
                .describe(
                    "Sum of all likes + retweets + replies + quotes + bookmarks across all posts",
                ),
        })
        .describe(
            "Per-metric engagement averages computed directly from the dataset",
        ),

    top_post_id: z
        .string()
        .describe(
            "tweet_id of the single highest-engagement post (likes + retweets + replies + quotes + bookmarks)",
        ),

    media_usage_rate: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Percentage (0–100) of posts that contain at least one photo or video attachment. Round to one decimal place.",
        ),

    language_distribution: z
        .array(
            z.object({
                lang: z
                    .string()
                    .describe("ISO 639-1 language code, e.g. 'en', 'fr', 'de'"),
                count: z
                    .number()
                    .int()
                    .min(1)
                    .describe("Number of posts in this language"),
            }),
        )
        .min(1)
        .max(5)
        .describe(
            "Top languages used across posts, sorted by count descending. Include only languages with at least 1 post.",
        ),

    content_style: z
        .object({
            format: z
                .enum([
                    "link_sharing",
                    "original_commentary",
                    "thread_focused",
                    "mixed",
                ])
                .describe(
                    "Primary content format: link_sharing (most posts share external URLs with short captions), " +
                        "original_commentary (most posts are self-contained opinions or analysis), " +
                        "thread_focused (most posts are part of multi-tweet threads), " +
                        "mixed (no dominant format)",
                ),
            description: z
                .string()
                .describe(
                    "1-2 sentence characterization of writing style, tone, and structure. " +
                        "Be specific: reference sentence length, use of media, typical post structure. " +
                        "Example: 'Posts follow a consistent pattern: one-line descriptive caption followed by a GitHub URL and a screenshot. No hashtags, no emojis, minimal punctuation.'",
                ),
        })
        .describe(
            "Structured characterization of how the account formats and writes its content",
        ),

    audience_signals: z
        .string()
        .describe(
            "2-3 specific, evidence-based sentences about the audience's apparent interests, engagement patterns, and behavioral signals. " +
                "Cite actual metrics or topics from the data (e.g. which post types get the most bookmarks, reply patterns, retweet-to-like ratios). " +
                "Never use single-word or hyphenated labels like 'developer_focused', 'tech_audience', or 'niche_community'. " +
                "Example: 'Bookmark rates (avg 15/post) far exceed retweet rates (avg 2/post), indicating a research-oriented audience " +
                "that saves content for later rather than sharing it publicly. Highest engagement clusters around LLM tooling and open-source " +
                "infrastructure posts; fitness and image-processing posts receive 60% less engagement, suggesting they fall outside the core audience interest.'",
        ),
});

export const analysisResultSchema = z.object({
    sentiment: sentimentSchema,
    topics: z
        .array(topicSchema)
        .min(1)
        .max(10)
        .describe("Top topics, ordered by frequency descending"),
    account_intelligence: accountIntelligenceSchema,
});

export type AnalysisResultOutput = z.infer<typeof analysisResultSchema>;
