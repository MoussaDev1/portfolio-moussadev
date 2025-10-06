"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProjects } from "@/lib/hooks";
import { Project, ProjectType } from "@/types/api";
import ProjectForm from "./components/ProjectForm";
import ProjectsList from "./components/ProjectsList";
import ProjectDetails from "./components/ProjectDetails";
import TechRadarAdmin from "./tech-radar/page";

export default function AdminDashboard() {
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "list" | "details" | "create" | "tech-radar"
  >("list");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement du dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">Erreur</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleProjectCreated = () => {
    refetch();
    setActiveTab("list");
  };

  const handleProjectUpdated = () => {
    refetch();
    setSelectedProject(null);
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            📊 Dashboard Admin
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("list");
                setSelectedProject(null);
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              📋 Projets
            </button>
            <button
              onClick={() => {
                setActiveTab("create");
                setSelectedProject(null);
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "create"
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              ➕ Nouveau Projet
            </button>
            <button
              onClick={() => {
                setActiveTab("tech-radar");
                setSelectedProject(null);
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "tech-radar"
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              🧭 Tech Radar
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Projets
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {projects.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Zone System
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {
                projects.filter((p) => p.type === ProjectType.ZONE_SYSTEM)
                  .length
              }
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Floor System
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {
                projects.filter((p) => p.type === ProjectType.FLOOR_SYSTEM)
                  .length
              }
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              En Cours
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {projects.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {activeTab === "list" && (
            <ProjectsList
              projects={projects}
              onSelectProject={(project: Project) => {
                setSelectedProject(project);
                setActiveTab("details");
              }}
              onRefresh={refetch}
            />
          )}

          {activeTab === "create" && (
            <ProjectForm
              onProjectCreated={handleProjectCreated}
              onCancel={() => {
                setActiveTab("list");
              }}
            />
          )}

          {activeTab === "details" && selectedProject && (
            <ProjectDetails
              project={selectedProject}
              onProjectUpdated={handleProjectUpdated}
              onBack={() => {
                setSelectedProject(null);
                setActiveTab("list");
              }}
            />
          )}

          {activeTab === "tech-radar" && <TechRadarAdmin />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
