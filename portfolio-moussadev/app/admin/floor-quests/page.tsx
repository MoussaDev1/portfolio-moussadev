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
import {
  Building2,
  Target,
  Plus,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
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
        data,
      ),
    {
      onSuccess: () => {
        setShowForm(false);
        refetch();
      },
    },
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateFloorQuestDto }) =>
      apiClient.updateFloorQuest(
        selectedProjectId || "",
        selectedFloorId || "",
        id,
        data,
      ),
    {
      onSuccess: () => {
        setShowForm(false);
        setEditingQuest(undefined);
        refetch();
      },
    },
  );

  const deleteMutation = useMutation(
    (id: string) =>
      apiClient.deleteFloorQuest(
        selectedProjectId || "",
        selectedFloorId || "",
        id,
      ),
    {
      onSuccess: () => {
        refetch();
      },
    },
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
    }),
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
              { order: tempOrder },
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
              { order: finalOrder },
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
    data: CreateFloorQuestDto | UpdateFloorQuestDto,
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
      (q) => q.status === QuestStatus.IN_PROGRESS,
    ).length,
    testing: localFloorQuests.filter((q) => q.status === QuestStatus.TESTING)
      .length,
    done: localFloorQuests.filter((q) => q.status === QuestStatus.DONE).length,
    blocked: localFloorQuests.filter((q) => q.status === QuestStatus.BLOCKED)
      .length,
    totalEstimatedPomodoros: localFloorQuests.reduce(
      (acc, q) => acc + (q.estimatedPomodoros || 0),
      0,
    ),
    totalActualPomodoros: localFloorQuests.reduce(
      (acc, q) => acc + (q.actualPomodoros || 0),
      0,
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
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Gestion des Floor Quests
              </h1>
              <p className="text-sm text-muted-foreground">
                Gérez les quêtes de vos Floors
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Project & Floor Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-select">Projet</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={(value) => {
                    setSelectedProjectId(value);
                    setSelectedFloorId(""); // Reset floor selection
                  }}
                  disabled={projectsLoading}
                >
                  <SelectTrigger id="project-select">
                    <SelectValue placeholder="Sélectionnez un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title} ({project.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor-select">Floor</Label>
                <Select
                  value={selectedFloorId}
                  onValueChange={setSelectedFloorId}
                  disabled={!selectedProjectId || floorsLoading}
                >
                  <SelectTrigger id="floor-select">
                    <SelectValue placeholder="Tous les Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les Floors</SelectItem>
                    {floors?.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search & Filters */}
            {selectedProjectId && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                {/* Search */}
                <div className="sm:col-span-1 space-y-2">
                  <Label htmlFor="search">
                    <Search className="inline h-4 w-4 mr-1" />
                    Recherche
                  </Label>
                  <Input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titre ou user story..."
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Statut</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as QuestStatus | "ALL")
                    }
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous</SelectItem>
                      <SelectItem value={QuestStatus.TODO}>À faire</SelectItem>
                      <SelectItem value={QuestStatus.IN_PROGRESS}>
                        En cours
                      </SelectItem>
                      <SelectItem value={QuestStatus.TESTING}>Tests</SelectItem>
                      <SelectItem value={QuestStatus.DONE}>Terminée</SelectItem>
                      <SelectItem value={QuestStatus.BLOCKED}>
                        Bloquée
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <Label htmlFor="priority-filter">Priorité</Label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) =>
                      setPriorityFilter(value as Priority | "ALL")
                    }
                  >
                    <SelectTrigger id="priority-filter">
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes</SelectItem>
                      <SelectItem value={Priority.LOW}>Basse</SelectItem>
                      <SelectItem value={Priority.MEDIUM}>Moyenne</SelectItem>
                      <SelectItem value={Priority.HIGH}>Haute</SelectItem>
                      <SelectItem value={Priority.CRITICAL}>
                        Critique
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Create Button */}
            {selectedProjectId && selectedFloorId && (
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleCreate}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Quête
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {selectedProjectId && localFloorQuests.length > 0 && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.inProgress}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.done}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pomodoros Est.
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalEstimatedPomodoros}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content */}
        {!selectedProjectId ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sélectionnez un projet pour voir les Floor Quests
              </p>
            </CardContent>
          </Card>
        ) : !selectedFloorId ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sélectionnez un Floor pour voir ses quêtes
              </p>
            </CardContent>
          </Card>
        ) : floorQuestsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
            <p className="text-muted-foreground">Chargement des quêtes...</p>
          </div>
        ) : filteredFloorQuests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {searchQuery ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL"
                  ? "Aucune quête ne correspond aux filtres"
                  : "Aucune quête dans ce Floor"}
              </p>
              {!searchQuery &&
                statusFilter === "ALL" &&
                priorityFilter === "ALL" && (
                  <Button
                    onClick={handleCreate}
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la première quête
                  </Button>
                )}
            </CardContent>
          </Card>
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
    </div>
  );
}
