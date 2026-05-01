"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    ResponsiveContainer,
    type TooltipContentProps,
} from "recharts";
import type { Topic } from "@/app/api/analyses/type";
import { Card, CardContent } from "@/components/ui/card";

const BASE_COLOR = "#6366f1";

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
    const name = (payload[0].payload as { name: string }).name;
    return (
        <div style={TOOLTIP_STYLE}>
            <p className="mb-0.5 font-medium">{name}</p>
            <p className="text-muted-foreground">
                <span className="text-foreground font-medium tabular-nums">
                    {payload[0].value}
                </span>{" "}
                mentions
            </p>
        </div>
    );
}

interface Props {
    topics: Topic[];
}

export function TopicsChart({ topics }: Props) {
    const sorted = [...topics]
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 8);

    const maxFreq = sorted[0]?.frequency ?? 1;

    return (
        <Card className="h-full">
            <CardContent className="flex min-h-0 flex-1 flex-col">
                <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
                    Topic Landscape
                </p>

                <div className="min-h-96 flex-1 lg:min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={sorted}
                            layout="vertical"
                            margin={{ left: 0, right: 12, top: 0, bottom: 0 }}
                            barCategoryGap="20%"
                        >
                            <XAxis
                                type="number"
                                hide
                                domain={[0, maxFreq * 1.1]}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={118}
                                tick={{
                                    fontSize: 12,
                                    fill: "currentColor",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={CustomTooltip}
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar dataKey="frequency" radius={[0, 5, 5, 0]}>
                                {sorted.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={BASE_COLOR}
                                        fillOpacity={
                                            1 - (i / sorted.length) * 0.55
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
