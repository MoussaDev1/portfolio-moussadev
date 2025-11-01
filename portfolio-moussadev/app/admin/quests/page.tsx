"use client";

import { Suspense, useState, useEffect } from "react";
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
import {
  Target,
  Castle,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AdminQuestsPageContent() {
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
    selectedProjectId || "",
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
    ({ id, data }: { id: string; data: UpdateZoneQuestDto }) =>
      apiClient.updateZoneQuest(
        selectedProjectId || "",
        selectedZoneId || "",
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
      apiClient.deleteZoneQuest(
        selectedProjectId || "",
        selectedZoneId || "",
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
          p.zones?.some((z) => z.id === urlZoneId),
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
    data: CreateZoneQuestDto | UpdateZoneQuestDto,
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
        (quest) => quest.zoneId === zone.id,
      );
      const completedQuests = zoneQuests.filter(
        (quest) => quest.status === QuestStatus.DONE,
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
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Gestion des Quêtes
              </h1>
              <p className="text-sm text-muted-foreground">
                Gérez vos quêtes par zone pour un suivi détaillé
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Selection */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Project Filter */}
              <div className="space-y-2">
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
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Zone Filter */}
              <div className="space-y-2">
                <Label htmlFor="zone-select">Zone</Label>
                <Select
                  value={selectedZoneId}
                  onValueChange={setSelectedZoneId}
                  disabled={zonesLoading || !selectedProjectId}
                >
                  <SelectTrigger id="zone-select">
                    <SelectValue placeholder="Sélectionnez une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones?.map((zone) => {
                      const stats = zoneStats.find((s) => s.id === zone.id);
                      return (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name} ({stats?.totalQuests || 0} quêtes,{" "}
                          {stats?.completionPercentage || 0}% terminé)
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Zone Stats */}
            {selectedZoneId &&
              zoneStats
                .filter((zone) => zone.id === selectedZoneId)
                .map((zone) => (
                  <div key={zone.id} className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {zone.totalQuests}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Quêtes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {zone.completedQuests}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Terminées
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <Activity className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {
                              quests.filter(
                                (q) => q.status === QuestStatus.IN_PROGRESS,
                              ).length
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            En Cours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {zone.completionPercentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Progression
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Quests List */}
        {questsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement des quêtes...</p>
          </div>
        ) : !selectedProjectId ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sélectionnez un projet pour voir ses quêtes
              </p>
            </CardContent>
          </Card>
        ) : !selectedZoneId ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Castle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sélectionnez une zone pour voir ses quêtes
              </p>
            </CardContent>
          </Card>
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

export default function AdminQuestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      }
    >
      <AdminQuestsPageContent />
    </Suspense>
  );
}
