"use client";

import { RiTwitterXFill } from "@remixicon/react";

interface ExampleAccount {
    handle: string;
    description: string;
}

const EXAMPLE_ACCOUNTS: ExampleAccount[] = [
    { handle: "@elonmusk", description: "Tech & Business" },
    { handle: "@animetrends", description: "Anime & Japanese culture" },
    { handle: "@BBCWorld", description: "World news" },
];

export default function SearchExamples({
    onSelect,
}: {
    onSelect?: (url: string) => void;
}) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <RiTwitterXFill className="size-3" />
                Try:
            </span>
            {EXAMPLE_ACCOUNTS.map((account) => (
                <button
                    key={account.handle}
                    type="button"
                    onClick={() =>
                        onSelect?.(
                            `https://x.com/${account.handle.replace("@", "")}`,
                        )
                    }
                    className="text-muted-foreground/70 hover:text-foreground cursor-pointer text-xs transition-colors"
                    title={account.description}
                >
                    {account.handle}
                </button>
            ))}
        </div>
    );
}
