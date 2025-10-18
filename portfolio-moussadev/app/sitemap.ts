import { MetadataRoute } from "next";
import { apiClient } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://moussadev.com";
  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const projects = await apiClient.getProjects();
    projectEntries = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.dateCompleted
        ? new Date(project.dateCompleted)
        : new Date(project.createdAt),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    }));
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tech-radar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projectEntries,
  ];
}
