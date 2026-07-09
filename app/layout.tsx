import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evolyft — Modern Learning Intelligence Platform",
  description:
    "Elevate the way you learn. Track study habits, manage roadmap milestones, save bookmarks, and analyze learning consistency with Evolyft.",
  keywords: [
    "Study habits",
    "Learning roadmap",
    "Developer productivity",
    "Study tracker",
    "Milestones tracker",
    "Next.js productivity",
  ],
  authors: [{ name: "Evolyft Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased dark-gradient min-h-screen bg-grid-pattern selection:bg-violet-500/30 selection:text-violet-200">
        {children}
      </body>
    </html>
  );
}
