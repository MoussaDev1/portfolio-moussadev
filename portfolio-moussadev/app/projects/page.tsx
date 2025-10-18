"use client";

import { useState, useEffect } from "react";
import { Loader2, FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/public/Footer";
import ProjectCard from "@/components/public/ProjectCard";
import { useProjects } from "@/lib/hooks";
import { Project } from "@/types/api";

export default function ProjectsPage() {
  // Récupère uniquement les projets featured (visibles publiquement)
  const { projects, loading, error } = useProjects(true);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement des projets...</p>
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
          <div className="text-center text-destructive">
            <h2 className="text-2xl font-bold mb-4">Erreur</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Mes Projets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez mes réalisations et explorez les technologies que
            j&apos;utilise pour créer des solutions innovantes.
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FolderOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Aucun projet disponible pour le moment.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
