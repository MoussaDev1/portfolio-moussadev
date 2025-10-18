"use client";

import { useState } from "react";
import { Project } from "@/types/api";
import { useProjects } from "@/lib/hooks/useProjects";

import ProjectsList from "@/components/admin/projects/ProjectsList";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import ProjectDetails from "@/components/admin/projects/ProjectDetails";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Castle,
  Building2,
  Activity,
} from "lucide-react";

export default function ProjectsAdminPage() {
  const { projects, loading, error, refetch } = useProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<"list" | "form" | "details">("list");

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setView("details");
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setView("form");
  };

  const handleCreateNew = () => {
    setSelectedProject(null);
    setView("form");
  };

  const handleProjectCreated = () => {
    setView("list");
    refetch();
  };

  const handleProjectUpdated = () => {
    setView("list");
    refetch();
  };

  const handleCancel = () => {
    setSelectedProject(null);
    setView("list");
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setView("list");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Chargement des projets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">
                Erreur lors du chargement des projets
              </p>
              <Button onClick={() => refetch()}>Réessayer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Gestion des Projets
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Créez et gérez vos projets Zone System et Floor System
                </p>
              </div>
            </div>

            {view === "list" && (
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            )}

            {view !== "list" && (
              <Button variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {projects?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Projets
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {projects?.filter((p) => p.status === "ACTIVE").length ||
                        0}
                    </div>
                    <div className="text-sm text-muted-foreground">Actifs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Castle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {projects?.filter((p) => p.type === "ZONE_SYSTEM")
                        .length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Zone System
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {projects?.filter((p) => p.type === "FLOOR_SYSTEM")
                        .length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Floor System
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            {view === "list" && (
              <ProjectsList
                projects={projects || []}
                onSelectProject={handleSelectProject}
                onEditProject={handleEditProject}
                onRefresh={refetch}
              />
            )}

            {view === "form" && (
              <ProjectForm
                initialProject={selectedProject}
                onProjectSaved={
                  selectedProject ? handleProjectUpdated : handleProjectCreated
                }
                onCancel={handleCancel}
              />
            )}

            {view === "details" && selectedProject && (
              <ProjectDetails
                project={selectedProject}
                onProjectUpdated={handleProjectUpdated}
                onBack={handleBackToList}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
