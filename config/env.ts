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
