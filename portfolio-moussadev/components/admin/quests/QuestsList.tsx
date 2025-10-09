"use client";

import { useState, useMemo } from "react";
import { Quest, QuestStatus, Priority } from "@/types/api";
import { QuestCard } from "./QuestCard";
import { HiFilter, HiSearch, HiPlus } from "react-icons/hi";
import clsx from "clsx";

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
      const statusCounts = quests.reduce((acc, quest) => {
        acc[quest.status] = (acc[quest.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const priorityCounts = quests.reduce((acc, quest) => {
        acc[quest.priority] = (acc[quest.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

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
                item.toLowerCase().includes(search)
              ))
        );
      }

      // Status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((quest) => quest.status === statusFilter);
      }

      // Priority filter
      if (priorityFilter !== "all") {
        filtered = filtered.filter(
          (quest) => quest.priority === priorityFilter
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Chargement des quêtes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une quête..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-md border transition-colors",
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            )}
          >
            <HiFilter className="h-5 w-5" />
            Filtres
          </button>

          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <HiPlus className="h-5 w-5" />
            Nouvelle quête
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {statusFiltersWithCounts.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {priorityFiltersWithCounts.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {filteredQuests.length} quête{filteredQuests.length !== 1 ? "s" : ""}
          {filteredQuests.length !== quests.length && ` sur ${quests.length}`}
        </span>

        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          {quests.length === 0 ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aucune quête dans cette zone
              </p>
              <button
                onClick={onCreate}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Créer la première quête
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aucune quête ne correspond aux filtres
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Réinitialiser les filtres
              </button>
            </>
          )}
        </div>
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
