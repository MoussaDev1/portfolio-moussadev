"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import { useZones } from "@/lib/hooks/useZones";
import { useZoneQuests, useProjectQuests } from "@/lib/hooks/useZoneQuests";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import { Quest, QuestStatus } from "@/types/api";
import { CreateZoneQuestDto, UpdateZoneQuestDto } from "@/types/forms";
import { QuestsList } from "@/components/admin/quests/QuestsList";
import { QuestForm } from "@/components/admin/quests/QuestForm";
import { Filter, BarChart } from "lucide-react";

export default function AdminQuestsPage() {
  const searchParams = useSearchParams();
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>();

  // Récupérer les zones du projet sélectionné
  const { zones, loading: zonesLoading } = useZones(selectedProjectId || "");

  // Récupérer toutes les quêtes du projet pour les stats
  const { quests: allProjectQuests } = useProjectQuests(
    selectedProjectId || ""
  );

  // Récupérer les quests de la zone sélectionnée
  const {
    quests,
    loading: questsLoading,
    refetch,
  } = useZoneQuests(selectedProjectId || "", selectedZoneId || "");

  // Mutations
  const createMutation = useMutation(
    (data: CreateZoneQuestDto) =>
      apiClient.createZoneQuest(
        selectedProjectId || "",
        selectedZoneId || "",
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
    ({ id, data }: { id: string; data: UpdateZoneQuestDto }) =>
      apiClient.updateZoneQuest(
        selectedProjectId || "",
        selectedZoneId || "",
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
      apiClient.deleteZoneQuest(
        selectedProjectId || "",
        selectedZoneId || "",
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
    const urlZoneId = searchParams.get("zoneId");
    const urlProjectId = searchParams.get("projectId");

    if (urlZoneId && urlProjectId) {
      setSelectedProjectId(urlProjectId);
      setSelectedZoneId(urlZoneId);
    } else if (urlZoneId && projects && projects.length > 0) {
      // Si seulement zoneId est fourni, trouver le projet correspondant
      const zone = projects
        .flatMap((p) => p.zones || [])
        .find((z) => z.id === urlZoneId);
      if (zone) {
        const project = projects.find((p) =>
          p.zones?.some((z) => z.id === urlZoneId)
        );
        if (project) {
          setSelectedProjectId(project.id);
          setSelectedZoneId(urlZoneId);
        }
      }
    }
  }, [searchParams, projects]);

  // Sélectionner automatiquement le premier projet si aucun paramètre URL
  useEffect(() => {
    const urlZoneId = searchParams.get("zoneId");
    const urlProjectId = searchParams.get("projectId");

    if (
      !urlZoneId &&
      !urlProjectId &&
      projects &&
      projects.length > 0 &&
      !selectedProjectId
    ) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, searchParams]);

  // Sélectionner automatiquement la première zone si pas de paramètre URL
  useEffect(() => {
    const urlZoneId = searchParams.get("zoneId");

    if (!urlZoneId && zones && zones.length > 0 && !selectedZoneId) {
      setSelectedZoneId(zones[0].id);
    }
  }, [zones, selectedZoneId, searchParams]);

  // Reset zone selection when project changes (sauf si paramètre URL)
  useEffect(() => {
    const urlZoneId = searchParams.get("zoneId");
    if (!urlZoneId) {
      setSelectedZoneId("");
    }
  }, [selectedProjectId, searchParams]);

  const handleCreate = () => {
    if (!selectedZoneId) return;
    setEditingQuest(undefined);
    setShowForm(true);
  };

  const handleEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setShowForm(true);
  };

  const handleDelete = async (questId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette quête ?")) {
      await deleteMutation.mutate(questId);
    }
  };

  const handleStatusChange = async (questId: string, status: QuestStatus) => {
    await updateMutation.mutate({ id: questId, data: { status } });
  };

  const handleSubmit = async (
    data: CreateZoneQuestDto | UpdateZoneQuestDto
  ) => {
    if (editingQuest) {
      await updateMutation.mutate({ id: editingQuest.id, data });
    } else {
      await createMutation.mutate(data as CreateZoneQuestDto);
    }
  };

  const isLoading =
    createMutation.loading || updateMutation.loading || deleteMutation.loading;

  // Calculate zone stats using all project quests
  const zoneStats =
    zones?.map((zone) => {
      const zoneQuests = allProjectQuests.filter(
        (quest) => quest.zoneId === zone.id
      );
      const completedQuests = zoneQuests.filter(
        (quest) => quest.status === QuestStatus.DONE
      );
      return {
        ...zone,
        totalQuests: zoneQuests.length,
        completedQuests: completedQuests.length,
        completionPercentage:
          zoneQuests.length > 0
            ? Math.round((completedQuests.length / zoneQuests.length) * 100)
            : 0,
      };
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Quêtes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Gérez vos quêtes par zone pour un suivi détaillé
          </p>
        </div>

        {/* Filters & Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Project Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Projet
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={projectsLoading}
              >
                <option value="">Sélectionnez un projet</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BarChart className="inline h-4 w-4 mr-1" />
                Zone
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={zonesLoading || !selectedProjectId}
              >
                <option value="">Sélectionnez une zone</option>
                {zones?.map((zone) => {
                  const stats = zoneStats.find((s) => s.id === zone.id);
                  return (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({stats?.totalQuests || 0} quêtes,{" "}
                      {stats?.completionPercentage || 0}% terminé)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Zone Stats */}
          {selectedZoneId && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {zoneStats
                  .filter((zone) => zone.id === selectedZoneId)
                  .map((zone) => (
                    <div key={zone.id} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {zone.totalQuests}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Quêtes
                      </div>
                    </div>
                  ))}

                {zoneStats
                  .filter((zone) => zone.id === selectedZoneId)
                  .map((zone) => (
                    <div key={`completed-${zone.id}`} className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {zone.completedQuests}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Terminées
                      </div>
                    </div>
                  ))}

                {zoneStats
                  .filter((zone) => zone.id === selectedZoneId)
                  .map((zone) => (
                    <div key={`progress-${zone.id}`} className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {
                          quests.filter(
                            (q) => q.status === QuestStatus.IN_PROGRESS
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        En Cours
                      </div>
                    </div>
                  ))}

                {zoneStats
                  .filter((zone) => zone.id === selectedZoneId)
                  .map((zone) => (
                    <div key={`percentage-${zone.id}`} className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {zone.completionPercentage}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Progression
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quests List */}
        {questsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Chargement des quêtes...
            </p>
          </div>
        ) : !selectedProjectId ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Sélectionnez un projet pour voir ses quêtes
            </p>
          </div>
        ) : !selectedZoneId ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Sélectionnez une zone pour voir ses quêtes
            </p>
          </div>
        ) : (
          <QuestsList
            quests={quests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onCreate={handleCreate}
            loading={questsLoading}
          />
        )}

        {/* Form Modal */}
        {showForm && selectedZoneId && selectedProjectId && (
          <QuestForm
            quest={editingQuest}
            zoneId={selectedZoneId}
            projectId={selectedProjectId}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingQuest(undefined);
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
