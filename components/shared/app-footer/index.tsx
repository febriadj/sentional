import Link from "next/link";
import { RiTwitterXFill } from "@remixicon/react";

interface FooterLink {
    label: string;
    href: string;
}

const POLICY_LINKS: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
];

const PRODUCT_LINKS: FooterLink[] = [
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
];

export default function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-border/40 bg-background w-full border-t">
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-foreground text-background flex size-7 items-center justify-center rounded-lg">
                                <RiTwitterXFill className="size-3.5" />
                            </div>
                            <span className="text-foreground text-sm font-semibold tracking-tight">
                                Sentional
                            </span>
                        </div>
                        <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
                            Twitter&nbsp;/&nbsp;X Account Intelligence for
                            Sentiment Analysis, Activity Trends, and Topic
                            Discovery.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-12">
                        <div className="flex flex-col gap-3">
                            <span className="text-foreground text-xs font-medium">
                                Product
                            </span>
                            <ul className="flex flex-col gap-2">
                                {PRODUCT_LINKS.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-foreground text-xs font-medium">
                                Legal
                            </span>
                            <ul className="flex flex-col gap-2">
                                {POLICY_LINKS.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="bg-border/40 mt-8 h-px w-full" />
                <div className="mt-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
                    <p className="text-muted-foreground/60 text-xs">
                        &copy; {currentYear} Sentional. All rights reserved.
                    </p>
                    <p className="text-muted-foreground/40 text-xs">
                        Not affiliated with X Corp. or Twitter, Inc.
                    </p>
                </div>
            </div>
        </footer>
    );
}
