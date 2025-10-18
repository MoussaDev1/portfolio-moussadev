import { apiClient } from "./api";
import { Project } from "@/types/api";

/**
 * Récupère un projet par son slug pour la page publique
 * IMPORTANT : Retourne null si le projet n'est pas featured (protection public/privé)
 * @param slug - Le slug du projet
 * @returns Le projet complet si featured, null sinon
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await apiClient.getProjectBySlug(slug);

    // Vérification : seuls les projets featured sont accessibles publiquement
    if (!project.featured) {
      console.warn(`Projet ${slug} n'est pas featured, accès public refusé`);
      return null;
    }

    return project;
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet ${slug}:`, error);
    return null;
  }
}

/**
 * Récupère tous les projets pour la génération statique des pages
 * Filtre uniquement les projets "featured" pour le portfolio public
 * @returns Liste des projets publics
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    // Récupère uniquement les projets featured (mis en avant)
    const projects = await apiClient.getProjects(true);
    return projects;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return [];
  }
}

/**
 * Récupère tous les slugs de projets pour generateStaticParams
 * @returns Liste des slugs
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const projects = await getAllProjects();
    return projects.map((project) => project.slug);
  } catch (error) {
    console.error("Erreur lors de la récupération des slugs:", error);
    return [];
  }
}

/**
 * Récupère uniquement les projets featured (mis en avant) pour la page d'accueil
 * Utilise Server-Side Rendering pour afficher les derniers projets
 * @returns Liste des projets featured
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    // Récupère uniquement les projets featured=true depuis l'API backend
    const projects = await apiClient.getProjects(true);
    return projects;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des projets featured:",
      error,
    );
    return [];
  }
}
