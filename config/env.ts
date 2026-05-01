import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    MONGODB_URI: z
        .string()
        .min(1, "MONGODB_URI must not be empty")
        .refine(
            (val) =>
                val.startsWith("mongodb://") ||
                val.startsWith("mongodb+srv://"),
            {
                message:
                    "MONGODB_URI must be a valid MongoDB connection string",
            },
        ),
    TIKHUB_BASE_URL: z
        .url("TIKHUB_BASE_URL must be a valid URL")
        .default("https://api.tikhub.io"),
    TIKHUB_BEARER_TOKEN: z
        .string()
        .min(1, "TIKHUB_BEARER_TOKEN must not be empty"),
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
