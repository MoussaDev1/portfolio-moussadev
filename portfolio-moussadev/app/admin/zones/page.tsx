"use client";

import { useState, useEffect } from "react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useZones } from "@/lib/hooks/useZones";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import { Zone } from "@/types/api";
import { CreateZoneDto, UpdateZoneDto } from "@/types/forms";
import { ZoneCard } from "@/components/admin/zones/ZoneCard";
import { ZoneForm } from "@/components/admin/zones/ZoneForm";
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
import { Castle, Plus, Loader2, AlertTriangle } from "lucide-react";
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

// Composant wrapper pour rendre ZoneCard draggable
function SortableZoneCard({
  zone,
  projectId,
  onEdit,
  onDelete,
}: {
  zone: Zone;
  projectId: string;
  onEdit: (zone: Zone) => void;
  onDelete: (zoneId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: zone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ZoneCard
        zone={zone}
        projectId={projectId}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export default function AdminZonesPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | undefined>();
  const [localZones, setLocalZones] = useState<Zone[]>([]);

  // Récupérer les zones du projet sélectionné
  const {
    zones,
    loading: zonesLoading,
    refetch,
  } = useZones(selectedProjectId || "");

  // Mutations
  const createMutation = useMutation(
    (data: CreateZoneDto) =>
      apiClient.createZone(selectedProjectId || "", data),
    {
      onSuccess: () => {
        setShowForm(false);
        refetch();
      },
    },
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateZoneDto }) =>
      apiClient.updateZone(selectedProjectId || "", id, data),
    {
      onSuccess: () => {
        setShowForm(false);
        setEditingZone(undefined);
        refetch();
      },
    },
  );

  const deleteMutation = useMutation(
    (id: string) => apiClient.deleteZone(selectedProjectId || "", id),
    {
      onSuccess: () => {
        refetch();
      },
    },
  );

  // Synchroniser localZones avec zones
  useEffect(() => {
    if (zones) {
      setLocalZones(zones);
    }
  }, [zones]);

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
      const oldIndex = localZones.findIndex((z) => z.id === active.id);
      const newIndex = localZones.findIndex((z) => z.id === over.id);

      const newZones = arrayMove(localZones, oldIndex, newIndex);
      setLocalZones(newZones);

      // Mettre à jour l'état local avec les nouveaux ordres pour un affichage fluide
      const updatedZones = newZones.map((zone, index) => ({
        ...zone,
        order: index + 1,
      }));
      setLocalZones(updatedZones);

      // Mettre à jour l'ordre dans le backend en arrière-plan (sans refetch)
      try {
        // Phase 1: Assigner des ordres temporaires très élevés pour éviter les conflits
        const tempOrderStart = 10000;
        for (let i = 0; i < newZones.length; i++) {
          const zone = newZones[i];
          const tempOrder = tempOrderStart + i;

          if (zone.order !== i + 1) {
            // Seulement si l'ordre va changer
            await apiClient.updateZone(selectedProjectId || "", zone.id, {
              order: tempOrder,
            });
          }
        }

        // Phase 2: Assigner les vrais ordres
        for (let i = 0; i < newZones.length; i++) {
          const zone = newZones[i];
          const finalOrder = i + 1;

          if (zone.order !== finalOrder) {
            await apiClient.updateZone(selectedProjectId || "", zone.id, {
              order: finalOrder,
            });
          }
        }

        // Pas de refetch() ici - l'état local est déjà à jour !
      } catch (error) {
        console.error("Erreur lors de la réorganisation:", error);
        // Remettre l'ordre original en cas d'erreur
        if (zones) setLocalZones(zones);
      }
    }
  };

  const handleCreate = () => {
    setEditingZone(undefined);
    setShowForm(true);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setShowForm(true);
  };

  const handleDelete = async (zoneId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette zone ?")) {
      await deleteMutation.mutate(zoneId);
    }
  };

  const handleSubmit = async (data: CreateZoneDto | UpdateZoneDto) => {
    if (editingZone) {
      await updateMutation.mutate({ id: editingZone.id, data });
    } else {
      await createMutation.mutate(data as CreateZoneDto);
    }
  };

  const isLoading =
    createMutation.loading || updateMutation.loading || deleteMutation.loading;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Castle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Gestion des Zones
              </h1>
              <p className="text-sm text-muted-foreground">
                Organisez vos projets par zones pour une meilleure structure
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
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
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreate}
                disabled={!selectedProjectId}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle zone
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zones List */}
        {zonesLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
            <p className="text-muted-foreground">Chargement des zones...</p>
          </div>
        ) : !selectedProjectId ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sélectionnez un projet pour voir ses zones
              </p>
            </CardContent>
          </Card>
        ) : localZones.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Castle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucune zone dans ce projet
              </p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Créer la première zone
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
              items={localZones.map((z) => z.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {localZones.map((zone) => (
                  <SortableZoneCard
                    key={zone.id}
                    zone={zone}
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
          <ZoneForm
            zone={editingZone}
            projectId={selectedProjectId}
            existingZones={localZones}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingZone(undefined);
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
