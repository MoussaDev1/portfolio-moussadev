export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

export function getProjectStatusText(
  status: "completed" | "in_progress" | "planned"
): string {
  switch (status) {
    case "completed":
      return "✓ Terminé";
    case "in_progress":
      return "⏳ En cours";
    case "planned":
      return "📋 Planifié";
    default:
      return status;
  }
}

export function getProjectStatusColor(
  status: "completed" | "in_progress" | "planned"
): string {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-700 dark:text-green-300";
    case "in_progress":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "planned":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
  }
}

/**
 * Génère un slug URL-friendly à partir d'un texte
 * @param text - Le texte à convertir en slug
 * @returns Le slug généré (lowercase, sans caractères spéciaux, espaces remplacés par des tirets)
 *
 * @example
 * generateSlug("Mon Projet React") // "mon-projet-react"
 * generateSlug("API REST & GraphQL") // "api-rest-graphql"
 * generateSlug("Système d'authentification") // "systeme-dauthentification"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Convertir en minuscules
    .trim() // Supprimer les espaces en début et fin
    .normalize("NFD") // Normaliser les caractères Unicode (séparer les accents)
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les diacritiques (accents)
    .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux sauf espaces et tirets
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul tiret
    .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début et fin
}
