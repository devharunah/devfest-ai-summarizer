import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aaron Douglas project",
  description: "Next.js and Supabase project starter",
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
