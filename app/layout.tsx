import { geistSans, geistMono } from "./fonts";
import { metadata } from "./metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import AppNavbar from "@/components/shared/app-navbar";
import AppFooter from "@/components/shared/app-footer";

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
                </ThemeProvider>
            </body>
        </html>
    );
}
