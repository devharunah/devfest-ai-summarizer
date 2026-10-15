import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "You Don't Need the Python Backend · AI Summarizer",
  description:
    "Summarize, stream, extract and chat over long documents with Next.js and the Vercel AI SDK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
