import Link from "next/link";
import {
    RiMailLine,
    RiArrowRightLine,
    RiGithubLine,
    RiTwitterXFill,
    RiGithubFill,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

const PRODUCT_LINKS: FooterLink[] = [
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
    { label: "API Reference", href: "/api-reference" },
];

const RESOURCES_LINKS: FooterLink[] = [
    { label: "Blog", href: "/blog" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Examples", href: "/examples" },
    { label: "FAQ", href: "#faq" },
];

const LEGAL_LINKS: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
];

const SOCIAL_LINKS: FooterLink[] = [
    {
        label: "GitHub",
        href: "https://github.com/febriadj/sentional",
        external: true,
    },
    { label: "Twitter / X", href: "https://x.com", external: true },
];

export default function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-border/40 bg-background w-full border-t">
            <div className="mx-auto max-w-5xl px-6 py-8">
                {/* Newsletter */}
                <div className="mb-10 flex flex-col items-center gap-5 text-center">
                    <div className="border-border/50 bg-muted/50 inline-flex items-center gap-2 rounded-full border px-3 py-1">
                        <RiMailLine className="text-muted-foreground size-3.5" />
                        <span className="text-muted-foreground text-xs font-medium">
                            Newsletter
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                            Stay ahead of the curve.
                        </h2>
                        <p className="text-muted-foreground max-w-md text-base">
                            Get notified about new features, analysis
                            improvements, and insights on X account
                            intelligence.
                        </p>
                    </div>

                    <form className="w-full max-w-lg">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <RiMailLine className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="bg-background h-12 pr-4 pl-10 text-sm focus-visible:ring-2"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 shrink-0 gap-2 px-5"
                            >
                                <span>Subscribe</span>
                                <RiArrowRightLine className="size-4" />
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-border/40 mb-10 h-px w-full" />

                <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
                    {/* Brand */}
                    <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-foreground text-sm font-semibold tracking-tight">
                                Sentional™
                            </span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
                            Twitter / X account intelligence for marketers,
                            analysts, and researchers. Powered by AI, trusted by
                            professionals.
                        </p>
                        <div className="flex items-center gap-3">
                            {SOCIAL_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={label}
                                >
                                    {label === "GitHub" ? (
                                        <RiGithubFill className="size-4" />
                                    ) : (
                                        <RiTwitterXFill className="size-4" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-3 gap-x-10 gap-y-8 text-center sm:text-left">
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
                                Resources
                            </span>
                            <ul className="flex flex-col gap-2">
                                {RESOURCES_LINKS.map(({ label, href }) => (
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
                                {LEGAL_LINKS.map(({ label, href }) => (
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
                <div className="mt-16 flex flex-col items-center justify-between gap-2 sm:flex-row">
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
