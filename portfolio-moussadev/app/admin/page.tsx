"use client";

import { useState } from "react";
import {
  FolderKanban,
  Plus,
  Radar,
  Loader2,
  LayoutDashboard,
  Building2,
  Castle,
  Activity,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/public/Footer";
import { useProjects } from "@/lib/hooks";
import { Project, ProjectType } from "@/types/api";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import ProjectsList from "@/components/admin/projects/ProjectsList";
import ProjectDetails from "@/components/admin/projects/ProjectDetails";
import TechRadarAdmin from "./tech-radar/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge not used in this file (removed to fix unused import)

export default function AdminDashboard() {
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "list" | "details" | "create" | "tech-radar"
  >("list");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement du dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Dashboard Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Gérez vos projets et technologies
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "list" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("list");
                setSelectedProject(null);
              }}
            >
              <FolderKanban className="w-4 h-4 mr-2" />
              Projets
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("create");
                setSelectedProject(null);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
            <Button
              variant={activeTab === "tech-radar" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("tech-radar");
                setSelectedProject(null);
              }}
            >
              <Radar className="w-4 h-4 mr-2" />
              Tech Radar
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projets</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-500/50 transition-all hover:shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Castle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone System</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {
                      projects.filter((p) => p.type === ProjectType.ZONE_SYSTEM)
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-500/50 transition-all hover:shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Floor System</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {
                      projects.filter(
                        (p) => p.type === ProjectType.FLOOR_SYSTEM,
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-500/50 transition-all hover:shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Cours</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {projects.filter((p) => p.status === "ACTIVE").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-0">
            {activeTab === "list" && (
              <ProjectsList
                projects={projects}
                onSelectProject={(project: Project) => {
                  setSelectedProject(project);
                  setActiveTab("details");
                }}
                onEditProject={(project: Project) => {
                  setSelectedProject(project);
                  setActiveTab("create");
                }}
                onRefresh={refetch}
              />
            )}

            {activeTab === "create" && (
              <ProjectForm
                initialProject={selectedProject}
                onProjectSaved={handleProjectCreated}
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
