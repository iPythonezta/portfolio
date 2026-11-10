import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.title}, ${profile.headline}`,
  description: profile.tagline,
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} | ${profile.title}`,
    description: profile.tagline,
    type: "website",
  },
};
export const viewport: Viewport = { themeColor: "#0b0e14", width: "device-width", initialScale: 1 };

// Set the theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=(t==="light"||t==="dark")?t:"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
