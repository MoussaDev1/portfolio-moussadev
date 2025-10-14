"use client";

import { useState, useEffect } from "react";
import {
  Technology,
  CreateTechnologyDto,
  TechCategory,
  TechStatus,
} from "@/types/technology";
import { useTechnologies } from "@/lib/hooks/useTechnologies";
import TechnologyCard from "@/components/admin/technologies/TechnologyCard";
import TechnologyForm from "@/components/admin/technologies/TechnologyForm";

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

export default function TechRadarAdmin() {
  const {
    technologies,
    stats,
    loading,
    error,
    fetchTechnologies,
    fetchStats,
    createTechnology,
    updateTechnology,
    deleteTechnology,
  } = useTechnologies();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      const filters: { category?: string; status?: string } = {};
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedStatus !== "all") filters.status = selectedStatus;

      try {
        await Promise.all([fetchTechnologies(filters), fetchStats()]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadData();
  }, [selectedCategory, selectedStatus, fetchTechnologies, fetchStats]);

  const handleOpenModal = (technology?: Technology) => {
    setEditingTechnology(technology || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTechnology(null);
  };

  const handleSubmit = async (data: CreateTechnologyDto) => {
    try {
      if (editingTechnology) {
        await updateTechnology(editingTechnology.id, data);
      } else {
        await createTechnology(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTechnology(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
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
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ➕ Nouvelle technologie
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

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
          <TechnologyCard
            key={tech.id}
            technology={tech}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12 text-foreground/70">
          <p>Aucune technologie trouvée avec ces filtres.</p>
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {editingTechnology
                  ? "Modifier la technologie"
                  : "Nouvelle technologie"}
              </h2>
            </div>
            <div className="p-6">
              <TechnologyForm
                technology={editingTechnology}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
