"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import { useFloors } from "@/lib/hooks/useFloors";
import { useFloorQuests } from "@/lib/hooks/useFloorQuests";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import { FloorQuest, QuestStatus, Priority } from "@/types/api";
import { CreateFloorQuestDto, UpdateFloorQuestDto } from "@/types/forms";
import { FloorQuestCard } from "@/components/admin/floor-quests/FloorQuestCard";
import { FloorQuestForm } from "@/components/admin/floor-quests/FloorQuestForm";
import { HiFilter, HiPlus, HiSearch, HiChartBar } from "react-icons/hi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Composant wrapper pour rendre FloorQuestCard draggable
function SortableFloorQuestCard({
  floorQuest,
  onEdit,
  onDelete,
}: {
  floorQuest: FloorQuest;
  onEdit: (floorQuest: FloorQuest) => void;
  onDelete: (floorQuestId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: floorQuest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FloorQuestCard
        floorQuest={floorQuest}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export default function AdminFloorQuestsPage() {
  const searchParams = useSearchParams();
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<FloorQuest | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuestStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [localFloorQuests, setLocalFloorQuests] = useState<FloorQuest[]>([]);

  // Récupérer les floors du projet sélectionné
  const { floors, loading: floorsLoading } = useFloors(selectedProjectId || "");

  // Récupérer les floor quests
  const {
    floorQuests,
    loading: floorQuestsLoading,
    refetch,
  } = useFloorQuests({
    projectId: selectedProjectId || "",
    floorId: selectedFloorId || "",
  });

  // Mutations
  const createMutation = useMutation(
    (data: CreateFloorQuestDto) =>
      apiClient.createFloorQuest(
        selectedProjectId || "",
        selectedFloorId || "",
        data
      ),
    {
      onSuccess: () => {
        setShowForm(false);
        refetch();
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateFloorQuestDto }) =>
      apiClient.updateFloorQuest(
        selectedProjectId || "",
        selectedFloorId || "",
        id,
        data
      ),
    {
      onSuccess: () => {
        setShowForm(false);
        setEditingQuest(undefined);
        refetch();
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) =>
      apiClient.deleteFloorQuest(
        selectedProjectId || "",
        selectedFloorId || "",
        id
      ),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  // Gérer les paramètres URL pour pré-sélection
  useEffect(() => {
    const urlFloorId = searchParams.get("floorId");
    const urlProjectId = searchParams.get("projectId");

    if (urlFloorId && urlProjectId) {
      setSelectedProjectId(urlProjectId);
      setSelectedFloorId(urlFloorId);
    }
  }, [searchParams]);

  // Synchroniser localFloorQuests avec floorQuests
  useEffect(() => {
    if (floorQuests) {
      setLocalFloorQuests(floorQuests);
    }
  }, [floorQuests]);

  // Configuration drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localFloorQuests.findIndex((q) => q.id === active.id);
      const newIndex = localFloorQuests.findIndex((q) => q.id === over.id);

      const newQuests = arrayMove(localFloorQuests, oldIndex, newIndex);
      setLocalFloorQuests(newQuests);

      // Mettre à jour l'état local avec les nouveaux ordres
      const updatedQuests = newQuests.map((quest, index) => ({
        ...quest,
        order: index + 1,
      }));
      setLocalFloorQuests(updatedQuests);

      // Mettre à jour l'ordre dans le backend
      try {
        const tempOrderStart = 10000;
        for (let i = 0; i < newQuests.length; i++) {
          const quest = newQuests[i];
          const tempOrder = tempOrderStart + i;

          if (quest.order !== i + 1) {
            await apiClient.updateFloorQuest(
              selectedProjectId || "",
              selectedFloorId || "",
              quest.id,
              { order: tempOrder }
            );
          }
        }

        for (let i = 0; i < newQuests.length; i++) {
          const quest = newQuests[i];
          const finalOrder = i + 1;

          if (quest.order !== finalOrder) {
            await apiClient.updateFloorQuest(
              selectedProjectId || "",
              selectedFloorId || "",
              quest.id,
              { order: finalOrder }
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de la réorganisation:", error);
        if (floorQuests) setLocalFloorQuests(floorQuests);
      }
    }
  };

  const handleCreate = () => {
    setEditingQuest(undefined);
    setShowForm(true);
  };

  const handleEdit = (floorQuest: FloorQuest) => {
    setEditingQuest(floorQuest);
    setShowForm(true);
  };

  const handleDelete = async (floorQuestId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette quête ?")) {
      await deleteMutation.mutate(floorQuestId);
    }
  };

  const handleSubmit = async (
    data: CreateFloorQuestDto | UpdateFloorQuestDto
  ) => {
    if (editingQuest) {
      await updateMutation.mutate({
        id: editingQuest.id,
        data: data as UpdateFloorQuestDto,
      });
    } else {
      await createMutation.mutate(data as CreateFloorQuestDto);
    }
  };

  // Filtrer les quêtes
  const filteredFloorQuests = localFloorQuests.filter((quest) => {
    const matchesSearch =
      searchQuery === "" ||
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.userStory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || quest.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || quest.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistiques
  const stats = {
    total: localFloorQuests.length,
    todo: localFloorQuests.filter((q) => q.status === QuestStatus.TODO).length,
    inProgress: localFloorQuests.filter(
      (q) => q.status === QuestStatus.IN_PROGRESS
    ).length,
    testing: localFloorQuests.filter((q) => q.status === QuestStatus.TESTING)
      .length,
    done: localFloorQuests.filter((q) => q.status === QuestStatus.DONE).length,
    blocked: localFloorQuests.filter((q) => q.status === QuestStatus.BLOCKED)
      .length,
    totalEstimatedPomodoros: localFloorQuests.reduce(
      (acc, q) => acc + (q.estimatedPomodoros || 0),
      0
    ),
    totalActualPomodoros: localFloorQuests.reduce(
      (acc, q) => acc + (q.actualPomodoros || 0),
      0
    ),
  };

  if (projectsLoading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des projets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Gestion des Floor Quests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les quêtes de vos Floors
        </p>
      </div>

      {/* Filters & Actions */}
      <div className="mb-6 space-y-4">
        {/* Project & Floor Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="project-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <HiFilter className="inline h-4 w-4 mr-1" />
              Projet
            </label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedFloorId(""); // Reset floor selection
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Choisir un projet --</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title} ({project.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="floor-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <HiFilter className="inline h-4 w-4 mr-1" />
              Floor
            </label>
            <select
              id="floor-select"
              value={selectedFloorId}
              onChange={(e) => setSelectedFloorId(e.target.value)}
              disabled={!selectedProjectId || floorsLoading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Tous les Floors --</option>
              {floors?.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Filters */}
        {selectedProjectId && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <HiSearch className="inline h-4 w-4 mr-1" />
                Recherche
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titre ou user story..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Statut
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as QuestStatus | "ALL")
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">Tous</option>
                <option value={QuestStatus.TODO}>À faire</option>
                <option value={QuestStatus.IN_PROGRESS}>En cours</option>
                <option value={QuestStatus.TESTING}>Tests</option>
                <option value={QuestStatus.DONE}>Terminée</option>
                <option value={QuestStatus.BLOCKED}>Bloquée</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label
                htmlFor="priority-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Priorité
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as Priority | "ALL")
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">Toutes</option>
                <option value={Priority.LOW}>Basse</option>
                <option value={Priority.MEDIUM}>Moyenne</option>
                <option value={Priority.HIGH}>Haute</option>
                <option value={Priority.CRITICAL}>Critique</option>
              </select>
            </div>
          </div>
        )}

        {/* Create Button */}
        {selectedProjectId && selectedFloorId && (
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              Nouvelle Quête
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      {selectedProjectId && localFloorQuests.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <HiChartBar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Statistiques
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                À faire
              </p>
              <p className="text-2xl font-bold text-gray-500">{stats.todo}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                En cours
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tests</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.testing}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Terminées
              </p>
              <p className="text-2xl font-bold text-green-600">{stats.done}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bloquées
              </p>
              <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pomodoros Est.
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalEstimatedPomodoros}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pomodoros Réels
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalActualPomodoros}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!selectedProjectId ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Sélectionnez un projet pour voir les Floor Quests
          </p>
        </div>
      ) : !selectedFloorId ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Sélectionnez un Floor pour voir ses quêtes
          </p>
        </div>
      ) : floorQuestsLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des quêtes...
          </p>
        </div>
      ) : filteredFloorQuests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL"
              ? "Aucune quête ne correspond aux filtres"
              : "Aucune quête dans ce Floor"}
          </p>
          {!searchQuery &&
            statusFilter === "ALL" &&
            priorityFilter === "ALL" && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <HiPlus className="h-5 w-5" />
                Créer la première quête
              </button>
            )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredFloorQuests.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredFloorQuests.map((floorQuest) => (
                <SortableFloorQuestCard
                  key={floorQuest.id}
                  floorQuest={floorQuest}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Form Modal */}
      {showForm && selectedProjectId && selectedFloorId && (
        <FloorQuestForm
          floorQuest={editingQuest}
          projectId={selectedProjectId}
          floorId={selectedFloorId}
          existingFloorQuests={localFloorQuests}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingQuest(undefined);
          }}
          isLoading={createMutation.loading || updateMutation.loading}
        />
      )}
    </div>
  );
}
