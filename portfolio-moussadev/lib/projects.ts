import { promises as fs } from "fs";
import path from "path";
import { ProjectsData, Project } from "@/types";

// Cache des projets pour éviter de relire le fichier à chaque fois
let projectsCache: ProjectsData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProjectsData(): Promise<ProjectsData> {
  const now = Date.now();

  // Utiliser le cache si disponible et valide
  if (projectsCache && now - cacheTimestamp < CACHE_DURATION) {
    return projectsCache;
  }

  try {
    const jsonDirectory = path.join(process.cwd(), "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/projects.json",
      "utf8"
    );
    const data: ProjectsData = JSON.parse(fileContents);

    // Mettre à jour le cache
    projectsCache = data;
    cacheTimestamp = now;

    return data;
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier projects.json:", error);
    throw new Error("Impossible de charger les données des projets");
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const data = await getProjectsData();
  return data.projects.sort(
    (a, b) =>
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const data = await getProjectsData();
  return data.projects.find((project) => project.slug === slug) || null;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const data = await getProjectsData();
  return data.projects
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
}

export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  const data = await getProjectsData();
  return data.projects
    .filter(
      (project) => project.category.toLowerCase() === category.toLowerCase()
    )
    .sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
}

export async function getProjectSlugs(): Promise<string[]> {
  const data = await getProjectsData();
  return data.projects.map((project) => project.slug);
}

export async function getCategories(): Promise<string[]> {
  const data = await getProjectsData();
  return data.categories;
}

export async function getTechnologies(): Promise<string[]> {
  const data = await getProjectsData();
  return data.technologies;
}
