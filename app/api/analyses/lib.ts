import { env } from "@/config/env";
import type { TikHubResponse, TikHubTweet } from "./type";

export async function fetchUserPosts(
    screenName: string,
): Promise<TikHubTweet[]> {
    const url = new URL(
        "/api/v1/twitter/web/fetch_user_post_tweet",
        env.TIKHUB_BASE_URL,
    );
    url.searchParams.set("screen_name", screenName);

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${env.TIKHUB_BEARER_TOKEN}`,
            Accept: "application/json",
        },
        next: { revalidate: 0 },
    });

    if (response.status === 429) {
        throw new Error("TikHub rate limit exceeded");
    }

    if (!response.ok) {
        throw new Error(
            `TikHub responded with ${response.status}: ${response.statusText}`,
        );
    }

    const json: TikHubResponse = await response.json();
    if (json.code !== 200 || !Array.isArray(json.data?.timeline)) {
        throw new Error(`Unexpected TikHub payload: code=${json.code}`);
    }

    return json.data.timeline;
}
