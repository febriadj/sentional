import { RiTwitterXFill } from "@remixicon/react";

interface ExampleAccount {
    handle: string;
    description: string;
}

const EXAMPLE_ACCOUNTS: ExampleAccount[] = [
    { handle: "@elonmusk", description: "Tech & news" },
    { handle: "@sama", description: "AI & startups" },
    { handle: "@BBCBreaking", description: "Breaking news" },
];

export default function SearchExamples() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <RiTwitterXFill className="size-3" />
                Try:
            </span>
            {EXAMPLE_ACCOUNTS.map((account) => (
                <span
                    key={account.handle}
                    className="text-muted-foreground/70 hover:text-foreground cursor-default text-xs transition-colors"
                    title={account.description}
                >
                    {account.handle}
                </span>
            ))}
        </div>
    );
}
