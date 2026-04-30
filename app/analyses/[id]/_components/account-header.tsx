import {
    RiVerifiedBadgeFill,
    RiUserLine,
    RiTwitterXFill,
} from "@remixicon/react";
import type { TikHubTweetAuthor } from "@/app/api/analyses/type";
import { Card, CardContent } from "@/components/ui/card";

function fmtFollowers(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

interface Props {
    author: TikHubTweetAuthor;
}

export function AccountHeader({ author }: Props) {
    return (
        <Card>
            <CardContent>
                <div className="flex items-center gap-4">
                    <img
                        src={author.avatar}
                        alt={author.name}
                        width={64}
                        height={64}
                        className="ring-border size-16 shrink-0 rounded-full object-cover ring-2"
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <h1 className="truncate text-xl leading-tight font-semibold">
                                {author.name}
                            </h1>
                            {author.blue_verified && (
                                <RiVerifiedBadgeFill
                                    size={18}
                                    className="shrink-0 text-sky-500"
                                />
                            )}
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            @{author.screen_name}
                        </p>
                        <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                            <RiUserLine size={13} />
                            <span>
                                {fmtFollowers(author.followers_count)} followers
                            </span>
                        </div>
                    </div>

                    <a
                        href={`https://x.com/${author.screen_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground shrink-0 text-xs transition-colors"
                    >
                        View on <RiTwitterXFill className="inline" size={12} />
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
