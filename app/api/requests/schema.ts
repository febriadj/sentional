import { z } from "zod";

export const createRequestSchema = z.object({
    source_url: z
        .string()
        .min(1, "source_url is required")
        .refine(
            (val) => {
                try {
                    const url = new URL(
                        val.startsWith("http") ? val : `https://${val}`,
                    );
                    return (
                        url.hostname === "x.com" ||
                        url.hostname === "twitter.com" ||
                        url.hostname === "www.x.com" ||
                        url.hostname === "www.twitter.com"
                    );
                } catch {
                    return false;
                }
            },
            { message: "source_url must be a valid Twitter/X account URL" },
        ),
});
