import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const baseUrl = "https://moussadev.com";

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.date_completed
      ? new Date(project.date_completed)
      : new Date(project.date_created),
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.6,
  }));

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
    ...projectEntries,
  ];
}
