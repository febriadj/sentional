import { z } from "zod";

const envSchema = z.object({
    // General
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    // KV Storage (Upstash Redis)
    KV_REST_API_READ_ONLY_TOKEN: z
        .string()
        .min(1, "KV_REST_API_READ_ONLY_TOKEN must not be empty"),
    KV_URL: z.url("KV_URL must be a valid URL"),
    KV_REST_API_URL: z.url("KV_REST_API_URL must be a valid URL"),
    KV_REST_API_TOKEN: z.string().min(1, "KV_REST_API_TOKEN must not be empty"),

    // Redis
    REDIS_URL: z.url("REDIS_URL must be a valid URL"),

    // TikHub API
    TIKHUB_BASE_URL: z
        .url("TIKHUB_BASE_URL must be a valid URL")
        .default("https://api.tikhub.io"),
    TIKHUB_BEARER_TOKEN: z
        .string()
        .min(1, "TIKHUB_BEARER_TOKEN must not be empty"),

    // OpenRouter
    OPENROUTER_API_KEY: z
        .string()
        .min(1, "OPENROUTER_API_KEY must not be empty"),
    OPENROUTER_HTTP_REFERER: z
        .string()
        .optional()
        .default("http://localhost:3000"),
    OPENROUTER_APP_TITLE: z.string().optional().default("Sentional"),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
    const errors = _parsed.error.flatten().fieldErrors;
    console.error("Invalid environment variables:", errors);
    throw new Error(
        "Invalid environment variables — check server logs for details.",
    );
}

export const env = _parsed.data;

export type Env = z.infer<typeof envSchema>;
