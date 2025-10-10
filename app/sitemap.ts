export default function sitemap() {
  return [
    {
      url: "https://rich-gambian.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];
}
