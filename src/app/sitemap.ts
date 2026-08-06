import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/login", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/signup", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/privacidad", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/terminos", changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
