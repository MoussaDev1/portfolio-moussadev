"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Technology, TechCategory, TechStatus } from "@/types/technology";

const CATEGORY_LABELS = {
  [TechCategory.LANGUAGES]: "Langages",
  [TechCategory.FRAMEWORKS]: "Frameworks",
  [TechCategory.LIBRARIES]: "Librairies",
  [TechCategory.TOOLS]: "Outils",
  [TechCategory.PLATFORMS]: "Plateformes",
  [TechCategory.DATABASES]: "Bases de données",
  [TechCategory.DEVOPS]: "DevOps",
};

const STATUS_LABELS = {
  [TechStatus.MASTERED]: "Maîtrisée",
  [TechStatus.LEARNING]: "En apprentissage",
  [TechStatus.TO_REVIEW]: "À revoir",
  [TechStatus.EXPLORING]: "Exploration",
  [TechStatus.DEPRECATED]: "Obsolète",
};

const STATUS_COLORS = {
  [TechStatus.MASTERED]: "bg-green-100 text-green-800 border-green-200",
  [TechStatus.LEARNING]: "bg-blue-100 text-blue-800 border-blue-200",
  [TechStatus.TO_REVIEW]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [TechStatus.EXPLORING]: "bg-purple-100 text-purple-800 border-purple-200",
  [TechStatus.DEPRECATED]: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function TechRadarPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    loadTechnologies();
  }, [selectedCategory, selectedStatus]);

  const loadTechnologies = async () => {
    try {
      setLoading(true);

      const filters: { category?: string; status?: string } = {};
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedStatus !== "all") filters.status = selectedStatus;

      const data = await apiClient.getTechnologies(filters);

      // Filtrer les technologies obsolètes en public (optionnel)
      const filteredData = data.filter(
        (tech) => tech.status !== TechStatus.DEPRECATED
      );
      setTechnologies(filteredData);
    } catch (error) {
      console.error("Erreur lors du chargement des technologies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Organiser par catégorie pour un affichage en radar
  const technologiesByCategory = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<TechCategory, Technology[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🧭 Mon Tech Radar
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Découvrez les technologies que j&apos;explore, maîtrise et utilise
            dans mes projets. Un aperçu de mon évolution technique et de mes
            domaines d&apos;expertise.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-background rounded-lg border p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Filtrer par catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Filtrer par niveau
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les niveaux</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Technologies par catégorie */}
        <div className="space-y-12">
          {Object.entries(technologiesByCategory).map(([category, techs]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <span className="w-1 h-8 bg-blue-600 rounded mr-4"></span>
                {CATEGORY_LABELS[category as TechCategory]}
                <span className="ml-3 text-lg font-normal text-foreground/70">
                  ({techs.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-background rounded-lg border hover:border-blue-300 transition-all duration-200 hover:shadow-lg group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {tech.iconUrl ? (
                            <img
                              src={tech.iconUrl}
                              alt={tech.name}
                              className="w-12 h-12 rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xl">
                                {tech.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                              {tech.name}
                            </h3>
                            {tech.websiteUrl && (
                              <a
                                href={tech.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-foreground/50 hover:text-blue-600 transition-colors"
                              >
                                Site officiel ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            STATUS_COLORS[tech.status]
                          }`}
                        >
                          {STATUS_LABELS[tech.status]}
                        </span>
                      </div>

                      {/* Description */}
                      {tech.description && (
                        <p className="text-sm text-foreground/70 mb-4">
                          {tech.description}
                        </p>
                      )}

                      {/* Projets et articles liés */}
                      <div className="space-y-3">
                        {tech.projects.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-foreground/70 mb-2">
                              Projets utilisant cette technologie :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tech.projects.slice(0, 3).map((projectTech) => (
                                <Link
                                  key={projectTech.project.id}
                                  href={`/projects/${projectTech.project.slug}`}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                >
                                  {projectTech.project.title}
                                </Link>
                              ))}
                              {tech.projects.length > 3 && (
                                <span className="text-xs text-foreground/50">
                                  +{tech.projects.length - 3} autres
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {tech.posts.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-foreground/70 mb-2">
                              Articles connexes :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tech.posts
                                .filter((p) => p.post.published)
                                .slice(0, 2)
                                .map((postTech) => (
                                  <Link
                                    key={postTech.post.id}
                                    href={`/blog/${postTech.post.slug}`}
                                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                                  >
                                    {postTech.post.title}
                                  </Link>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {technologies.length === 0 && (
          <div className="text-center py-16 text-foreground/70">
            <p className="text-lg">
              Aucune technologie trouvée avec ces filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
