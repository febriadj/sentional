"use client";

import { useState } from "react";
import { RiLink, RiArrowRightLine, RiLoader4Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputFormProps {
    placeholder?: string;
}

export default function UrlInputForm({
    placeholder = "https://x.com/username",
}: UrlInputFormProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url.trim() || isLoading) return;
        // Server-side API call will be wired here
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <RiLink className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={placeholder}
                        className="bg-background h-12 pr-4 pl-10 text-sm focus-visible:ring-2"
                        aria-label="Twitter/X account URL"
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
        </form>
    );
}
