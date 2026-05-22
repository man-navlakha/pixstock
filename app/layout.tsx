import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.pixstock.dev"),
  title: {
    default: "PixStock | Docs",
    template: "%s | PixStock Docs",
  },
  description:
    "Explore PixStock documentation for fast, reliable, developer-friendly asset infrastructure.",
  applicationName: "PixStock Docs",
  keywords: [
    "PixStock",
    "asset infrastructure",
    "developer documentation",
    "media API",
    "asset management",
  ],
  authors: [{ name: "PixStock" }],
  creator: "PixStock",
  publisher: "PixStock",
  openGraph: {
    title: "PixStock | Docs",
    description:
      "Fast, reliable, developer-friendly asset infrastructure for modern products.",
    url: "https://docs.pixstock.dev",
    siteName: "PixStock Docs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixStock | Docs",
    description:
      "Fast, reliable, developer-friendly asset infrastructure for modern products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      <body className="min-h-full bg-white font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <RootProvider
          theme={{
            attribute: "class",
            defaultTheme: "dark",
            enableSystem: false,
            disableTransitionOnChange: true,
          }}
          search={{
            options: {
              placeholder: "Search PixStock docs...",
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
