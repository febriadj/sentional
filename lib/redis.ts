import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default redis;

/** TTL for all keys — 24 hours in seconds */
export const TTL = 60 * 60 * 24;

export const Keys = {
    analysisRequest: (id: string) => `analysis_request:${id}`,
    analysis: (analysisRequestId: string) => `analysis:${analysisRequestId}`,
} as const;
