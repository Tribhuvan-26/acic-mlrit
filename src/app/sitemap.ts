import type { MetadataRoute } from "next";
import { getAllVerticalIds } from "@/app/programs/programs-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://acicmlrit.in";
  const now = new Date();

  const routes = [
    { url: "/",           priority: 1.0,  changeFrequency: "weekly"  as const },
    { url: "/about",      priority: 0.8,  changeFrequency: "monthly" as const },
    { url: "/programs",   priority: 0.9,  changeFrequency: "monthly" as const },
    ...getAllVerticalIds().map((id) => ({
      url: `/programs/${id}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    { url: "/contact",    priority: 0.6,  changeFrequency: "yearly"  as const },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${base}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
