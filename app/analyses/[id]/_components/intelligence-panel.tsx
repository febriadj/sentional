import {
    RiTimeLine,
    RiCalendarLine,
    RiImageLine,
    RiFileTextLine,
    RiGlobalLine,
    RiGroupLine,
} from "@remixicon/react";
import type {
    AccountIntelligence,
    ContentFormatType,
    PostingFrequencyLevel,
} from "@/app/api/analyses/type";
import { Card, CardContent } from "@/components/ui/card";

const LEVEL_LABEL: Record<PostingFrequencyLevel, string> = {
    very_high: "Very High",
    high: "High",
    medium: "Medium",
    low: "Low",
    irregular: "Irregular",
};

const LEVEL_STYLE: Record<PostingFrequencyLevel, string> = {
    very_high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    medium: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    irregular:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const FORMAT_LABEL: Record<ContentFormatType, string> = {
    link_sharing: "Link Sharing",
    original_commentary: "Original Commentary",
    thread_focused: "Thread Focused",
    mixed: "Mixed",
};

function fmtDate(iso: string): string {
    try {
        return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        });
    } catch {
        return iso;
    }
}

interface Props {
    intelligence: AccountIntelligence;
}

export function IntelligencePanel({ intelligence }: Props) {
    const {
        posting_frequency,
        peak_activity,
        media_usage_rate,
        language_distribution,
        content_style,
        audience_signals,
    } = intelligence;

    const langTotal = language_distribution.reduce((s, e) => s + e.count, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Card size="sm">
                    <CardContent>
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                            <RiTimeLine size={13} />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Posting Frequency
                            </span>
                        </div>
                        <span
                            className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLE[posting_frequency.level]}`}
                        >
                            {LEVEL_LABEL[posting_frequency.level]}
                        </span>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {posting_frequency.summary}
                        </p>
                    </CardContent>
                </Card>

                <Card size="sm">
                    <CardContent>
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                            <RiCalendarLine size={13} />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Peak Activity
                            </span>
                        </div>
                        <p className="text-lg leading-tight font-semibold">
                            {fmtDate(peak_activity)}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                            highest post volume day
                        </p>
                    </CardContent>
                </Card>

                <Card size="sm">
                    <CardContent>
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                            <RiImageLine size={13} />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Media Usage
                            </span>
                        </div>
                        <p className="text-2xl font-bold tabular-nums">
                            {media_usage_rate.toFixed(1)}
                            <span className="text-muted-foreground ml-0.5 text-sm font-normal">
                                %
                            </span>
                        </p>
                        <div className="bg-muted mt-2.5 h-1.5 overflow-hidden rounded-full">
                            <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{
                                    width: `${Math.min(media_usage_rate, 100)}%`,
                                }}
                            />
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                            posts with media attached
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card size="sm">
                    <CardContent>
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                            <RiFileTextLine size={13} />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Content Style
                            </span>
                        </div>
                        <span className="bg-secondary text-secondary-foreground mb-2.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                            {FORMAT_LABEL[content_style.format]}
                        </span>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {content_style.description}
                        </p>
                    </CardContent>
                </Card>

                <Card size="sm">
                    <CardContent>
                        <div className="text-muted-foreground mb-3 flex items-center gap-1.5">
                            <RiGlobalLine size={13} />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Language Mix
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {language_distribution.map((entry) => {
                                const pct =
                                    langTotal > 0
                                        ? Math.round(
                                              (entry.count / langTotal) * 100,
                                          )
                                        : 0;
                                return (
                                    <div
                                        key={entry.lang}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="text-muted-foreground w-6 font-mono text-xs uppercase">
                                            {entry.lang}
                                        </span>
                                        <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-muted-foreground w-8 text-right text-xs tabular-nums">
                                            {pct}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card size="sm">
                <CardContent>
                    <div className="text-muted-foreground mb-2 flex items-center gap-1.5">
                        <RiGroupLine size={13} />
                        <span className="text-xs font-medium tracking-wide uppercase">
                            Audience Signals
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {audience_signals}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
