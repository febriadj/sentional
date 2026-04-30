// ---------------------------------------------------------------------------
// TikHub API — Twitter Get User Posts response types
// Ref: /api/v1/twitter/web/fetch_user_post_tweet
// ---------------------------------------------------------------------------

export interface TikHubTweetUrl {
    display_url: string;
    expanded_url: string;
    url: string;
}

export interface TikHubTweetEntities {
    hashtags: string[];
    symbols: string[];
    timestamps: string[];
    urls: TikHubTweetUrl[];
    user_mentions: string[];
}

export interface TikHubTweetPhoto {
    media_url_https: string;
    id: string;
    sizes: { h: number; w: number };
}

export interface TikHubTweetMedia {
    photo?: TikHubTweetPhoto[];
}

export interface TikHubTweetAuthor {
    rest_id: string;
    name: string;
    screen_name: string;
    avatar: string;
    followers_count: number;
    blue_verified: boolean;
}

export interface TikHubTweet {
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
    conversation_id: string;
    source: string;
    entities: TikHubTweetEntities;
    media?: TikHubTweetMedia;
    author: TikHubTweetAuthor;
}

export interface TikHubUserProfile {
    rest_id: string;
    name: string;
    screen_name: string;
    desc: string;
    avatar: string;
    header_image: string;
    followers_count: number;
    friends: number;
    statuses_count: number;
    media_count: number;
    created_at: string;
    location: string;
    website: string;
    blue_verified: boolean;
    protected: boolean;
    pinned_tweet_ids_str: string | null;
    status: string;
    id: string;
}

export interface TikHubTimelineData {
    timeline: TikHubTweet[];
    next_cursor: string;
    prev_cursor: string;
    status: string;
    user: TikHubUserProfile;
}

export interface TikHubResponse {
    code: number;
    request_id: string;
    message: string;
    data: TikHubTimelineData;
}

// ---------------------------------------------------------------------------
// Analysis result types (matches Zod schema in schema.ts)
// ---------------------------------------------------------------------------

export interface SentimentDistribution {
    positive: number;
    neutral: number;
    negative: number;
}

export interface Sentiment {
    overall: "positive" | "neutral" | "negative";
    score: number;
    distribution: SentimentDistribution;
    summary: string;
}

export interface Topic {
    name: string;
    frequency: number;
    representative_tweet_ids: string[];
}

export type PostingFrequencyLevel =
    | "very_high"
    | "high"
    | "medium"
    | "low"
    | "irregular";

export interface PostingFrequency {
    level: PostingFrequencyLevel;
    summary: string;
}

export interface EngagementBreakdown {
    avg_likes: number;
    avg_retweets: number;
    avg_replies: number;
    avg_bookmarks: number;
    avg_views: number;
    total_engagement: number;
}

export type ContentFormatType =
    | "link_sharing"
    | "original_commentary"
    | "thread_focused"
    | "mixed";

export interface ContentStyle {
    format: ContentFormatType;
    description: string;
}

export interface LanguageEntry {
    lang: string;
    count: number;
}

export interface AccountIntelligence {
    posting_frequency: PostingFrequency;
    peak_activity: string;
    engagement_breakdown: EngagementBreakdown;
    top_post_id: string;
    media_usage_rate: number;
    language_distribution: LanguageEntry[];
    content_style: ContentStyle;
    audience_signals: string;
}

export interface AnalysisResult {
    sentiment: Sentiment;
    topics: Topic[];
    account_intelligence: AccountIntelligence;
}

// ---------------------------------------------------------------------------
// MongoDB document
// ---------------------------------------------------------------------------

export interface AnalysisDocument {
    _id: string;
    analysis_request_id: string;
    screen_name: string;
    analysis_result: AnalysisResult;
    created_at: Date;
}

// ---------------------------------------------------------------------------
// API response shape
// ---------------------------------------------------------------------------

export interface AnalysisApiResponse {
    analysis_result: AnalysisResult;
    raw_posts: TikHubTweet[];
}

export interface AnalysisErrorResponse {
    error: string;
}
