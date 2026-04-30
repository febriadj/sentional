"use client";

import { useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { RiDoubleQuotesL } from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    handle: string;
}

const TESTIMONIALS_ROW_1: Testimonial[] = [
    {
        quote: "Sentional gave me a clear picture of how @sama thinks about AI safety — the topic clustering is surprisingly accurate.",
        author: "Alex Rivera",
        role: "AI Researcher",
        handle: "@alexrivera",
    },
    {
        quote: "I used it to prep for a podcast interview. The audience signals section saved me hours of manual scrolling.",
        author: "Priya Nair",
        role: "Podcast Host",
        handle: "@priyanair",
    },
    {
        quote: "The sentiment score matched exactly what I felt reading the account. Genuinely impressed by the accuracy.",
        author: "Tom Becker",
        role: "Journalist",
        handle: "@tombecker",
    },
    {
        quote: "Engagement breakdown by metric type is gold. Bookmark-to-like ratio alone tells you so much about an audience.",
        author: "Sara Chen",
        role: "Growth Strategist",
        handle: "@sarachen",
    },
    {
        quote: "Clean, fast, and the results actually make sense. No hallucinated 'tech bro' labels — real evidence-based insights.",
        author: "Marco D.",
        role: "Product Manager",
        handle: "@marcod",
    },
    {
        quote: "Content style classification is remarkably good. Identified thread-focused pattern I hadn't consciously noticed.",
        author: "Lena Vogel",
        role: "Content Strategist",
        handle: "@lenavogel",
    },
];

const TESTIMONIALS_ROW_2: Testimonial[] = [
    {
        quote: "Language distribution breakdown was a surprise — never realized how much English vs Portuguese the account mixes.",
        author: "Carlos Mendes",
        role: "Social Media Analyst",
        handle: "@carlosmendes",
    },
    {
        quote: "Peak activity date matched the news cycle perfectly. Sentional connected dots I wouldn't have spotted manually.",
        author: "Yuki Tanaka",
        role: "Digital Strategist",
        handle: "@yukitanaka",
    },
    {
        quote: "Used this before pitching a collaboration. The audience signals section was exactly what I needed for my deck.",
        author: "Fatima Al-Hassan",
        role: "Brand Consultant",
        handle: "@fatimaalh",
    },
    {
        quote: "The media usage rate surfaced a clear content shift — the account went image-heavy after a product launch.",
        author: "James Whitfield",
        role: "VC Analyst",
        handle: "@jamesw",
    },
    {
        quote: "Posting frequency level is a small thing but instantly tells you if an account is worth monitoring daily.",
        author: "Nina Kowalski",
        role: "Investor Relations",
        handle: "@ninakowalski",
    },
    {
        quote: "The topic landscape chart is the fastest way I've found to understand what someone actually cares about.",
        author: "Remi Okafor",
        role: "Research Lead",
        handle: "@remiokafor",
    },
];

const DURATION = 40;

function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <Card className="w-72 shrink-0 py-4 select-none">
            <CardContent className="px-5">
                <RiDoubleQuotesL
                    size={18}
                    className="text-muted-foreground/40 mb-2"
                />
                <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
                    {item.quote}
                </p>
                <div>
                    <p className="text-sm leading-none font-medium">
                        {item.author}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {item.role} · {item.handle}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function MarqueeRow({
    items,
    reverse = false,
}: {
    items: Testimonial[];
    reverse?: boolean;
}) {
    const controls = useAnimationControls();
    const doubled = [...items, ...items];

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex w-max gap-x-4 py-0.5"
                animate={controls}
                initial={false}
                onViewportEnter={() =>
                    controls.start({
                        x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
                        transition: {
                            duration: DURATION,
                            ease: "linear",
                            repeat: Infinity,
                        },
                    })
                }
            >
                {doubled.map((item, i) => (
                    <TestimonialCard key={i} item={item} />
                ))}
            </motion.div>
        </div>
    );
}

export default function TestimonialMarquee() {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient masks */}
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />

            <div className="flex flex-col gap-4">
                <MarqueeRow items={TESTIMONIALS_ROW_1} />
                <MarqueeRow items={TESTIMONIALS_ROW_2} reverse />
            </div>
        </div>
    );
}
