"use client";

import { useState } from "react";
import { Project } from "@/types/api";
import { useProjects } from "@/lib/hooks/useProjects";

import ProjectsList from "@/components/admin/projects/ProjectsList";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import ProjectDetails from "@/components/admin/projects/ProjectDetails";

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des projets...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-2">❌</div>
              <p className="text-red-600 dark:text-red-400 mb-4">
                Erreur lors du chargement des projets
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Projets
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Créez et gérez vos projets Zone System et Floor System
              </p>
            </div>

            {view === "list" && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>+</span>
                Nouveau Projet
              </button>
            )}

            {view !== "list" && (
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>←</span>
                Retour à la liste
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600">
                {projects?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Projets
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600">
                {projects?.filter((p) => p.status === "ACTIVE").length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Actifs
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600">
                {projects?.filter((p) => p.type === "ZONE_SYSTEM").length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Zone System
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-orange-600">
                {projects?.filter((p) => p.type === "FLOOR_SYSTEM").length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Floor System
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {view === "list" && (
            <ProjectsList
              projects={projects || []}
              onSelectProject={handleSelectProject}
              onEditProject={handleEditProject}
              onRefresh={refetch}
            />
          )}

          {view === "form" && (
            <div className="p-6">
              <ProjectForm
                initialProject={selectedProject}
                onProjectSaved={
                  selectedProject ? handleProjectUpdated : handleProjectCreated
                }
                onCancel={handleCancel}
              />
            </div>
          )}

          {view === "details" && selectedProject && (
            <div className="p-6">
              <ProjectDetails
                project={selectedProject}
                onProjectUpdated={handleProjectUpdated}
                onBack={handleBackToList}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
