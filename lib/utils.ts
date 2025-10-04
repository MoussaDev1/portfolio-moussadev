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
