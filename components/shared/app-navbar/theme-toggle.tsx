"use client";

import { useTheme } from "next-themes";
import {
    RiSunLine,
    RiMoonLine,
    RiComputerLine,
    RiCheckLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
    { value: "light", label: "Light", icon: RiSunLine },
    { value: "dark", label: "Dark", icon: RiMoonLine },
    { value: "system", label: "System", icon: RiComputerLine },
] as const;

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const activeIcon = resolvedTheme === "dark" ? RiMoonLine : RiSunLine;
    const ActiveIcon = activeIcon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Toggle theme"
                >
                    <ActiveIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                {THEMES.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className="flex items-center justify-between gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <Icon className="text-muted-foreground size-3.5" />
                            <span>{label}</span>
                        </div>
                        {theme === value && (
                            <RiCheckLine className="size-3.5" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
