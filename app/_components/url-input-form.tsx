"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiLink, RiArrowRightLine, RiLoader4Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputFormProps {
    placeholder?: string;
}

export default function UrlInputForm({
    placeholder = "https://x.com/username",
}: UrlInputFormProps) {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source_url: url.trim() }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(
                    data.details?.source_url?.[0] ??
                        data.error ??
                        "Something went wrong. Please try again.",
                );
                return;
            }

            const { id } = await response.json();
            router.push(`/analyses/${id}`);
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <RiLink className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                        <Input
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder={placeholder}
                            className="bg-background h-12 pr-4 pl-10 text-sm focus-visible:ring-2"
                            aria-label="Twitter/X account URL"
                            aria-invalid={!!error}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={!url.trim() || isLoading}
                        className="h-12 shrink-0 gap-2 px-5"
                    >
                        {isLoading ? (
                            <RiLoader4Line className="size-4 animate-spin" />
                        ) : (
                            <>
                                <span>Analyze</span>
                                <RiArrowRightLine className="size-4" />
                            </>
                        )}
                    </Button>
                </div>
                {error && (
                    <p className="text-destructive px-1 text-xs">{error}</p>
                )}
            </div>
        </form>
    );
}
