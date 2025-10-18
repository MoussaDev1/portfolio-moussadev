"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useFloors } from "@/lib/hooks/useFloors";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import { Floor } from "@/types/api";
import { CreateFloorDto, UpdateFloorDto } from "@/types/forms";
import { FloorCard } from "@/components/admin/floors/FloorCard";
import { FloorForm } from "@/components/admin/floors/FloorForm";
import { Building2, Plus, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

// Composant wrapper pour rendre FloorCard draggable
function SortableFloorCard({
  floor,
  projectId,
  onEdit,
  onDelete,
}: {
  floor: Floor;
  projectId: string;
  onEdit: (floor: Floor) => void;
  onDelete: (floorId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: floor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FloorCard
        floor={floor}
        projectId={projectId}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export default function AdminFloorsPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | undefined>();
  const [localFloors, setLocalFloors] = useState<Floor[]>([]);

  // Récupérer les floors du projet sélectionné
  const {
    floors,
    loading: floorsLoading,
    refetch,
  } = useFloors(selectedProjectId || "");

  // Mutations
  const createMutation = useMutation(
    (data: CreateFloorDto) =>
      apiClient.createFloor(selectedProjectId || "", data),
    {
      onSuccess: () => {
        setShowForm(false);
        refetch();
      },
    },
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateFloorDto }) =>
      apiClient.updateFloor(selectedProjectId || "", id, data),
    {
      onSuccess: () => {
        setShowForm(false);
        setEditingFloor(undefined);
        refetch();
      },
    },
  );

  const deleteMutation = useMutation(
    (id: string) => apiClient.deleteFloor(selectedProjectId || "", id),
    {
      onSuccess: () => {
        refetch();
      },
    },
  );

  // Synchroniser localFloors avec floors
  useEffect(() => {
    if (floors) {
      setLocalFloors(floors);
    }
  }, [floors]);

  // Sélectionner automatiquement le premier projet
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

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
      const oldIndex = localFloors.findIndex((f) => f.id === active.id);
      const newIndex = localFloors.findIndex((f) => f.id === over.id);

      const newFloors = arrayMove(localFloors, oldIndex, newIndex);
      setLocalFloors(newFloors);

      // Mettre à jour l'état local avec les nouveaux ordres pour un affichage fluide
      const updatedFloors = newFloors.map((floor, index) => ({
        ...floor,
        order: index + 1,
      }));
      setLocalFloors(updatedFloors);

      // Mettre à jour l'ordre dans le backend en arrière-plan (sans refetch)
      try {
        // Phase 1: Assigner des ordres temporaires très élevés pour éviter les conflits
        const tempOrderStart = 10000;
        for (let i = 0; i < newFloors.length; i++) {
          const floor = newFloors[i];
          const tempOrder = tempOrderStart + i;

          if (floor.order !== i + 1) {
            // Seulement si l'ordre va changer
            await apiClient.updateFloor(selectedProjectId || "", floor.id, {
              order: tempOrder,
            });
          }
        }

        // Phase 2: Assigner les vrais ordres
        for (let i = 0; i < newFloors.length; i++) {
          const floor = newFloors[i];
          const finalOrder = i + 1;

          if (floor.order !== finalOrder) {
            await apiClient.updateFloor(selectedProjectId || "", floor.id, {
              order: finalOrder,
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la réorganisation:", error);
        // Remettre l'ordre original en cas d'erreur
        if (floors) setLocalFloors(floors);
      }
    }
  };

  const handleCreate = () => {
    setEditingFloor(undefined);
    setShowForm(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setShowForm(true);
  };

  const handleDelete = async (floorId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce floor ?")) {
      await deleteMutation.mutate(floorId);
    }
  };

  const handleSubmit = async (data: CreateFloorDto | UpdateFloorDto) => {
    if (editingFloor) {
      await updateMutation.mutate({
        id: editingFloor.id,
        data: data as UpdateFloorDto,
      });
    } else {
      await createMutation.mutate(data as CreateFloorDto);
    }
  };

  // Statistiques des floors
  const floorStats = {
    total: localFloors.length,
    totalQuests: localFloors.reduce(
      (acc, f) => acc + (f.floorQuests?.length || 0),
      0,
    ),
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
          <p className="text-muted-foreground">Chargement des projets...</p>
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
              <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Gestion des Floors
              </h1>
              <p className="text-sm text-muted-foreground">
                Organisez vos projets Floor System en étages
              </p>
            </div>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Project Filter */}
              <div className="flex-1 w-full sm:max-w-md space-y-2">
                <Label htmlFor="project-select">Projet</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
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

              {/* Create Button */}
              {selectedProjectId && (
                <Button
                  onClick={handleCreate}
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Floor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {selectedProjectId && localFloors.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Floors
                    </p>
                    <p className="text-2xl font-bold">{floorStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Floor Quests
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {floorStats.totalQuests}
                    </p>
                  </div>
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
                Sélectionnez un projet pour gérer ses floors
              </p>
            </CardContent>
          </Card>
        ) : floorsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
            <p className="text-muted-foreground">Chargement des floors...</p>
          </div>
        ) : localFloors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Aucun floor dans ce projet
              </p>
              <Button
                onClick={handleCreate}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier floor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localFloors.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {localFloors.map((floor) => (
                  <SortableFloorCard
                    key={floor.id}
                    floor={floor}
                    projectId={selectedProjectId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Form Modal */}
        {showForm && (
          <FloorForm
            floor={editingFloor}
            projectId={selectedProjectId}
            existingFloors={localFloors}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingFloor(undefined);
            }}
            isLoading={createMutation.loading || updateMutation.loading}
          />
        )}
      </div>
    </div>
  );
}
