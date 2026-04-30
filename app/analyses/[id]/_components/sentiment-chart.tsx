"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    type TooltipContentProps,
} from "recharts";
import type { Sentiment } from "@/app/api/analyses/type";
import { Card, CardContent } from "@/components/ui/card";

const SENTIMENT_COLORS = {
    Positive: "#4ade80",
    Neutral: "#94a3b8",
    Negative: "#f87171",
} as const;

const TOOLTIP_STYLE = {
    borderRadius: "8px",
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    color: "var(--color-card-foreground)",
    fontSize: "12px",
    padding: "6px 10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
} as const;

function CustomTooltip({ active, payload }: TooltipContentProps) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div style={TOOLTIP_STYLE}>
            <span className="font-medium">{name}</span>
            <span className="ml-2 tabular-nums">{value}%</span>
        </div>
    );
}

interface Props {
    sentiment: Sentiment;
}

export function SentimentChart({ sentiment }: Props) {
    const { overall, score, distribution, summary } = sentiment;

    const data = [
        { name: "Positive", value: distribution.positive },
        { name: "Neutral", value: distribution.neutral },
        { name: "Negative", value: distribution.negative },
    ].filter((d) => d.value > 0);

    return (
        <Card>
            <CardContent>
                <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
                    Sentiment Analysis
                </p>

                <div className="relative">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={58}
                                outerRadius={82}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={
                                            SENTIMENT_COLORS[
                                                entry.name as keyof typeof SENTIMENT_COLORS
                                            ]
                                        }
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={CustomTooltip} />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl leading-none font-bold tabular-nums">
                            {score.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground mt-1 text-xs font-medium capitalize">
                            {overall}
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-5">
                    {data.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5">
                            <div
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                    background:
                                        SENTIMENT_COLORS[
                                            d.name as keyof typeof SENTIMENT_COLORS
                                        ],
                                }}
                            />
                            <span className="text-muted-foreground text-xs">
                                {d.name}{" "}
                                <span className="text-foreground font-medium tabular-nums">
                                    {d.value}%
                                </span>
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-muted-foreground border-border mt-4 border-t pt-3 text-sm leading-relaxed">
                    {summary}
                </p>
            </CardContent>
        </Card>
    );
}
