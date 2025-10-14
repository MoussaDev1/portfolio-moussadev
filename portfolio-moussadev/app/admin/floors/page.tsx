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
    }
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
    }
  );

  const deleteMutation = useMutation(
    (id: string) => apiClient.deleteFloor(selectedProjectId || "", id),
    {
      onSuccess: () => {
        refetch();
      },
    }
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
    })
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
          🏢 Gestion des Floors
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organisez vos projets Floor System en étages
        </p>
      </div>

      {/* Project Selector & Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <label
            htmlFor="project-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <HiFilter className="inline h-4 w-4 mr-1" />
            Sélectionner un projet
          </label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
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

        {selectedProjectId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <HiPlus className="h-5 w-5" />
            Nouveau Floor
          </button>
        )}
      </div>

      {/* Statistics */}
      {selectedProjectId && localFloors.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Floors
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {floorStats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Floor Quests
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {floorStats.totalQuests}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!selectedProjectId ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Sélectionnez un projet pour gérer ses floors
          </p>
        </div>
      ) : floorsLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Chargement des floors...
          </p>
        </div>
      ) : localFloors.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🏢</div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Aucun floor dans ce projet
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <HiPlus className="h-5 w-5" />
            Créer le premier floor
          </button>
        </div>
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
  );
}
