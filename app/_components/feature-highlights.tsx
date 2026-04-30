import { RiEmotionLine, RiTimeLine, RiChat3Line } from "@remixicon/react";

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    {
        icon: RiEmotionLine,
        title: "Sentiment Analysis",
        description:
            "Measure the emotional tone of an account's posts to gauge overall sentiment and mood.",
    },
    {
        icon: RiTimeLine,
        title: "Activity Patterns",
        description:
            "Visualize posting frequency, peak hours, and long-term engagement trends.",
    },
    {
        icon: RiChat3Line,
        title: "Topic Discovery",
        description:
            "Surface recurring themes, keywords, and subjects shaping the account's narrative.",
    },
];

export default function FeatureHighlights() {
    return (
        <div className="border-border/40 bg-border/40 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                    key={title}
                    className="bg-background flex flex-col gap-2.5 px-5 py-5"
                >
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                        <Icon className="text-foreground/70 size-4" />
                    </div>
                    <p className="text-foreground text-sm font-medium">
                        {title}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        {description}
                    </p>
                </div>
            ))}
        </div>
    );
}
