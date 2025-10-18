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
import {
  Radar,
  Sparkles,
  Plus,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    null,
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
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression",
      );
    }
  };

  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tech.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Radar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Tech Radar</h1>
              <p className="text-sm text-muted-foreground">
                Gestion de mon radar technologique personnel
              </p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nouvelle technologie</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <Card className="border-destructive mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.byStatus.mastered}
                  </p>
                  <p className="text-xs text-muted-foreground">Maîtrisées</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.byStatus.learning}
                  </p>
                  <p className="text-xs text-muted-foreground">Apprentissage</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.byStatus.toReview}
                  </p>
                  <p className="text-xs text-muted-foreground">À revoir</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.byStatus.exploring}
                  </p>
                  <p className="text-xs text-muted-foreground">Exploration</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="space-y-2">
                <Label htmlFor="search">
                  <Search className="inline h-4 w-4 mr-1" />
                  Recherche
                </Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une technologie..."
                />
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="category-select">Catégorie</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="status-select">Statut</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status-select">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid des technologies */}
        {filteredTechnologies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune technologie trouvée avec ces filtres.
              </p>
            </CardContent>
          </Card>
        ) : (
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
    </div>
  );
}
