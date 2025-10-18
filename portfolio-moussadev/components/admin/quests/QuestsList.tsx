"use client";

import { useState, useMemo } from "react";
import { Quest, QuestStatus, Priority } from "@/types/api";
import { QuestCard } from "./QuestCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Plus, Loader2, AlertTriangle, X } from "lucide-react";
// cn utility not used here

interface QuestsListProps {
  quests: Quest[];
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStatusChange: (questId: string, status: QuestStatus) => void;
  onCreate: () => void;
  loading?: boolean;
}

const STATUS_FILTERS = [
  { value: "all", label: "Tous", count: 0 },
  { value: QuestStatus.TODO, label: "À faire", count: 0 },
  { value: QuestStatus.IN_PROGRESS, label: "En cours", count: 0 },
  { value: QuestStatus.TESTING, label: "En test", count: 0 },
  { value: QuestStatus.DONE, label: "Terminé", count: 0 },
  { value: QuestStatus.BLOCKED, label: "Bloqué", count: 0 },
];

const PRIORITY_FILTERS = [
  { value: "all", label: "Toutes", count: 0 },
  { value: Priority.CRITICAL, label: "Critique", count: 0 },
  { value: Priority.HIGH, label: "Haute", count: 0 },
  { value: Priority.MEDIUM, label: "Moyenne", count: 0 },
  { value: Priority.LOW, label: "Basse", count: 0 },
];

const SORT_OPTIONS = [
  { value: "created_desc", label: "Plus récent" },
  { value: "created_asc", label: "Plus ancien" },
  { value: "priority_desc", label: "Priorité haute" },
  { value: "priority_asc", label: "Priorité basse" },
  { value: "title_asc", label: "Titre A-Z" },
  { value: "title_desc", label: "Titre Z-A" },
];

export function QuestsList({
  quests,
  onEdit,
  onDelete,
  onStatusChange,
  onCreate,
  loading = false,
}: QuestsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate filter counts and filtered quests
  const { filteredQuests, statusFiltersWithCounts, priorityFiltersWithCounts } =
    useMemo(() => {
      // Count quests by status and priority
      const statusCounts = quests.reduce(
        (acc, quest) => {
          acc[quest.status] = (acc[quest.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const priorityCounts = quests.reduce(
        (acc, quest) => {
          acc[quest.priority] = (acc[quest.priority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Update filter options with counts
      const statusFiltersWithCounts = STATUS_FILTERS.map((filter) => ({
        ...filter,
        count:
          filter.value === "all"
            ? quests.length
            : statusCounts[filter.value] || 0,
      }));

      const priorityFiltersWithCounts = PRIORITY_FILTERS.map((filter) => ({
        ...filter,
        count:
          filter.value === "all"
            ? quests.length
            : priorityCounts[filter.value] || 0,
      }));

      // Filter quests
      let filtered = quests;

      // Search filter
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (quest) =>
            quest.title.toLowerCase().includes(search) ||
            quest.userStory.toLowerCase().includes(search) ||
            (quest.definitionOfDone &&
              quest.definitionOfDone.some((item) =>
                item.toLowerCase().includes(search),
              )),
        );
      }

      // Status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((quest) => quest.status === statusFilter);
      }

      // Priority filter
      if (priorityFilter !== "all") {
        filtered = filtered.filter(
          (quest) => quest.priority === priorityFilter,
        );
      }

      // Sort
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "created_desc":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "created_asc":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "priority_desc":
            const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case "priority_asc":
            const priorityOrderAsc = {
              CRITICAL: 4,
              HIGH: 3,
              MEDIUM: 2,
              LOW: 1,
            };
            return priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority];
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });

      return {
        filteredQuests: filtered,
        statusFiltersWithCounts,
        priorityFiltersWithCounts,
      };
    }, [quests, searchTerm, statusFilter, priorityFilter, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement des quêtes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une quête..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>

          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle quête
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFiltersWithCounts.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label} ({filter.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <Label htmlFor="priority-filter">Priorité</Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger id="priority-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityFiltersWithCounts.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label} ({filter.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label htmlFor="sort-by">Trier par</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredQuests.length} quête{filteredQuests.length !== 1 ? "s" : ""}
          {filteredQuests.length !== quests.length && ` sur ${quests.length}`}
        </span>

        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            {quests.length === 0 ? (
              <>
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Aucune quête dans cette zone
                </p>
                <Button onClick={onCreate}>Créer la première quête</Button>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Aucune quête ne correspond aux filtres
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
