import { geistSans, geistMono } from "./fonts";
import { metadata } from "./metadata";
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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">{children}</body>
        </html>
    );
}
