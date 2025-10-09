"use client";

import { useState } from "react";
import { Project, ProjectType, ProjectStatus } from "@/types/api";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onRefresh: () => void;
}

export default function ProjectsList({
  projects,
  onSelectProject,
  onEditProject,
  onRefresh,
}: ProjectsListProps) {
  const [filter, setFilter] = useState<"all" | ProjectType | ProjectStatus>(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { mutate: deleteProject, loading: deleting } = useMutation(
    (id: string) => apiClient.deleteProject(id),
    {
      onSuccess: () => {
        onRefresh(); // Refresh automatique après suppression
      },
    }
  );

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === project.type || filter === project.status) return true;

    return false;
  });

  const handleDelete = async (project: Project) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ?`
      )
    ) {
      await deleteProject(project.id);
      // Le refresh est automatique via onSuccess
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const badges = {
      [ProjectStatus.PLANNING]:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      [ProjectStatus.ACTIVE]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      [ProjectStatus.COMPLETED]:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      [ProjectStatus.PAUSED]:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    return badges[status] || badges[ProjectStatus.PLANNING];
  };

  const getTypeIcon = (type: ProjectType) => {
    return type === ProjectType.ZONE_SYSTEM ? "🏯" : "🏢";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📋 Gestion des Projets ({filteredProjects.length})
        </h2>
      </div>

      {/* Filtres et Recherche */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Tous les projets</option>
          <option value={ProjectType.ZONE_SYSTEM}>🏯 Zone System</option>
          <option value={ProjectType.FLOOR_SYSTEM}>🏢 Floor System</option>
          <option value={ProjectStatus.PLANNING}>📋 Planning</option>
          <option value={ProjectStatus.ACTIVE}>🚀 En Cours</option>
          <option value={ProjectStatus.COMPLETED}>✅ Terminés</option>
          <option value={ProjectStatus.PAUSED}>⏸️ En Pause</option>
        </select>
      </div>

      {/* Liste des Projets */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchTerm || filter !== "all"
              ? "Aucun projet ne correspond aux critères."
              : "Aucun projet trouvé."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {getTypeIcon(project.type)}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies &&
                      project.technologies.map((tech) => (
                        <span
                          key={tech.technology.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs"
                        >
                          {tech.technology.name}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Zones: {project.zones?.length || 0}</span>
                    <span>Floors: {project.floors?.length || 0}</span>
                    <span>
                      Créé:{" "}
                      {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm"
                  >
                    📝 Gérer
                  </button>
                  <button
                    onClick={() => onEditProject(project)}
                    className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded text-sm"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={deleting}
                    className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-sm disabled:opacity-50"
                  >
                    🗑️ Suppr.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
