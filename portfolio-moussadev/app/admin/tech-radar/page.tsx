"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import {
  Technology,
  TechRadarStats,
  TechCategory,
  TechStatus,
} from "@/types/technology";

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

export default function TechRadarAdmin() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [stats, setStats] = useState<TechRadarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);

      const filters: { category?: string; status?: string } = {};
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedStatus !== "all") filters.status = selectedStatus;

      const [techsData, statsData] = await Promise.all([
        apiClient.getTechnologies(filters),
        apiClient.getTechRadarStats(),
      ]);

      setTechnologies(techsData);
      setStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tech.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🧭 Tech Radar</h1>
          <p className="text-foreground/70">
            Gestion de mon radar technologique personnel
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          ➕ Nouvelle technologie
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <div className="text-sm text-foreground/70">Total technologies</div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus.mastered}
            </div>
            <div className="text-sm text-foreground/70">Maîtrisées</div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.byStatus.learning}
            </div>
            <div className="text-sm text-foreground/70">En apprentissage</div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.byStatus.toReview}
            </div>
            <div className="text-sm text-foreground/70">À revoir</div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-2xl font-bold text-purple-600">
              {stats.byStatus.exploring}
            </div>
            <div className="text-sm text-foreground/70">Exploration</div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-background rounded-lg p-4 border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Recherche
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une technologie..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-foreground mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid des technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnologies.map((tech) => (
          <div
            key={tech.id}
            className="bg-background rounded-lg border hover:border-blue-300 transition-colors cursor-pointer"
          >
            <div className="p-6">
              {/* Header de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {tech.iconUrl ? (
                    <img
                      src={tech.iconUrl}
                      alt={tech.name}
                      className="w-10 h-10 rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {tech.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {CATEGORY_LABELS[tech.category]}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded-full border ${
                    STATUS_COLORS[tech.status]
                  }`}
                >
                  {STATUS_LABELS[tech.status]}
                </span>
              </div>

              {/* Description */}
              {tech.description && (
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                  {tech.description}
                </p>
              )}

              {/* Statistiques */}
              <div className="flex items-center justify-between text-sm text-foreground/70">
                <div className="flex space-x-4">
                  <span>
                    {tech.projects.length} projet
                    {tech.projects.length > 1 ? "s" : ""}
                  </span>
                  <span>
                    {tech.posts.length} article
                    {tech.posts.length > 1 ? "s" : ""}
                  </span>
                </div>
                {tech.websiteUrl && (
                  <a
                    href={tech.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    🔗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12 text-foreground/70">
          <p>Aucune technologie trouvée avec ces filtres.</p>
        </div>
      )}
    </div>
  );
}
