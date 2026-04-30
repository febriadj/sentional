import { RiTwitterXFill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";

export default function AppNavbar() {
    return (
        <header className="border-border/40 bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                <div className="flex items-center gap-2.5">
                    <div className="bg-foreground text-background flex size-7 items-center justify-center rounded-lg">
                        <RiTwitterXFill className="size-3.5" />
                    </div>
                    <span className="text-foreground text-sm font-semibold tracking-tight">
                        Sentional
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="secondary"
                        className="hidden gap-1.5 font-normal sm:flex"
                    >
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Live
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                        Account Intelligence for Twitter&nbsp;/&nbsp;X
                    </span>
                </div>
            </div>
        </header>
    );
}
