import {
    RiHeartLine,
    RiRepeatLine,
    RiChat3Line,
    RiBookmarkLine,
    RiEyeLine,
    RiBarChartLine,
} from "@remixicon/react";
import type { EngagementBreakdown } from "@/app/api/analyses/type";
import { Card, CardContent } from "@/components/ui/card";

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n % 1 === 0 ? String(n) : n.toFixed(1);
}

const METRICS = [
    { key: "avg_likes", label: "Avg Likes", Icon: RiHeartLine },
    { key: "avg_retweets", label: "Avg Retweets", Icon: RiRepeatLine },
    { key: "avg_replies", label: "Avg Replies", Icon: RiChat3Line },
    { key: "avg_bookmarks", label: "Avg Bookmarks", Icon: RiBookmarkLine },
    { key: "avg_views", label: "Avg Views", Icon: RiEyeLine },
    {
        key: "total_engagement",
        label: "Total Engagement",
        Icon: RiBarChartLine,
    },
] as const satisfies {
    key: keyof EngagementBreakdown;
    label: string;
    Icon: React.ElementType;
}[];

interface Props {
    breakdown: EngagementBreakdown;
}

export function EngagementStats({ breakdown }: Props) {
    return (
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
            {METRICS.map(({ key, label, Icon }) => (
                <Card key={key} className="py-3">
                    <CardContent className="px-4">
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Icon size={13} />
                            <span className="truncate text-xs font-medium">
                                {label}
                            </span>
                        </div>
                        <p className="text-xl font-bold tracking-tight tabular-nums">
                            {fmt(breakdown[key])}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
