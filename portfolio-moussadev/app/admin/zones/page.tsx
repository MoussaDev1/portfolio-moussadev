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
import { HiPlus, HiFilter } from "react-icons/hi";
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
    }
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
    }
  );

  const deleteMutation = useMutation(
    (id: string) => apiClient.deleteZone(selectedProjectId || "", id),
    {
      onSuccess: () => {
        refetch();
      },
    }
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
    })
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Zones
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Organisez vos projets par zones pour une meilleure structure
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Project Filter */}
            <div className="flex items-center gap-3 flex-1">
              <HiFilter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={projectsLoading}
              >
                <option value="">Sélectionnez un projet</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              disabled={!selectedProjectId}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiPlus className="h-5 w-5" />
              Nouvelle zone
            </button>
          </div>
        </div>

        {/* Zones List */}
        {zonesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Chargement des zones...
            </p>
          </div>
        ) : !selectedProjectId ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Sélectionnez un projet pour voir ses zones
            </p>
          </div>
        ) : localZones.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aucune zone dans ce projet
            </p>
            <button
              onClick={handleCreate}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Créer la première zone
            </button>
          </div>
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
