import { geistSans, geistMono } from "./fonts";
import { metadata } from "./metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import AppNavbar from "@/components/shared/app-navbar";
import AppFooter from "@/components/shared/app-footer";
import "./globals.css";

export { metadata };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AppNavbar />
                    {children}
                    <AppFooter />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
