import type { Metadata } from "next";

export const SITE_URL = "https://rich-gambian.vercel.app";
export const SITE_NAME = "Spend The Gambia's Money";
export const SITE_DESCRIPTION =
  "Interactive GDP spending simulator for The Gambia. Spend GMD 159.7 billion on real estate, transport, food, and more — then share your receipt.";
export const SITE_TAGLINE =
  "How would you spend an entire country's GDP? Shop with GMD 159.7B, track your spending, and share a receipt.";

export function buildPageMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} | Gambia GDP Spending Simulator`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    category: "education",
    keywords: [
      "spend money game Gambia",
      "Gambia GDP simulator",
      "Gambia economy game",
      "interactive budget game",
      "money spending simulator",
      "educational finance game",
      "GMD spending game",
      "The Gambia GDP",
    ],
    authors: [{ name: "Ansu Badjie", url: SITE_URL }],
    creator: "Ansu Badjie",
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Gambia GDP Simulator`,
      description: SITE_TAGLINE,
      images: [
        {
          url: "/og-image.jpeg",
          width: 1200,
          height: 630,
          alt: "Spend The Gambia's Money — interactive GDP spending game",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Gambia GDP Simulator`,
      description: SITE_TAGLINE,
      images: ["/og-image.jpeg"],
    },
    alternates: {
      canonical: SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GMD",
      },
      author: {
        "@type": "Person",
        name: "Ansu Badjie",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much money do you start with in Spend The Gambia's Money?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You start with GMD 159.7 billion, representing The Gambia's GDP. Every purchase deducts from that balance in real time.",
          },
        },
        {
          "@type": "Question",
          name: "What can you buy in the Gambia GDP spending game?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can buy items ranging from everyday purchases like benachin for the compound to luxury assets such as private islands, jets, mansions, and football clubs.",
          },
        },
        {
          "@type": "Question",
          name: "Can I share my spending results?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. After making purchases you can generate a shareable spending receipt and send it to WhatsApp, social media, or download it as an image.",
          },
        },
      ],
    },
  ];
}