import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spend The Gambia's Money | Interactive GDP Spending 🇬🇲",
  description:
    "Ever wondered what you could buy with a country's entire GDP? Spend The Gambia's GMD159.7 billion GDP on luxury items, real estate, and businesses. Interactive shopping game with live charts, invoice downloads, and social sharing. Educational and fun!",
  keywords:
    "spend money game Gambia, GDP simulator Gambia, Gambia economy, interactive budget game Gambia, money spending simulator Gambia, educational finance game Gambia, luxury shopping game Gambia",
  authors: [{ name: "Ansu Badjie" }],
  openGraph: {
    title: "Spend The Gambia's Money 🇬🇲",
    description:
      "Interactive game: Spend GMD159.7 billion on private islands, yachts, jets & more! See what a country's wealth can really buy.",
    type: "website",
    locale: "en_US",
    siteName: "Spend The Gambia's Money",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Spend The Gambia's Money - Interactive Shopping Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spend The Gambia's Money 🇬🇲",
    description:
      "Interactive game where you spend an entire country's GDP! Buy islands, jets, and more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rich-gambian.vercel.app",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Spend The Gambia's Money",
  description:
    "Interactive money spending game where you shop with an entire country's GDP",
  applicationCategory: "Game",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GMD",
  },
  browserRequirements: "Requires JavaScript",
  author: {
    "@type": "Person",
    name: "Ansu Badjie",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1D3557" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  );
}
