import type { Metadata } from "next";
import { Google_Sans, Roboto_Mono } from "next/font/google";

import "./globals.css";

// GDG brand type: Google Sans for headlines and body, Roboto Mono Light for subheads.
const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-google-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-roboto-mono",
});

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
    <html lang="en" className={`${googleSans.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
