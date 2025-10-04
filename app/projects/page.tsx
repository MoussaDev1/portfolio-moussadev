"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des projets");
        }

        const data = await response.json();
        setProjects(data.projects);
        setFilteredProjects(data.projects);
        setCategories(["all", ...data.categories]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-foreground/60">Chargement des projets...</p>
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Mes Projets
            </h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Découvrez l&apos;ensemble de mes réalisations, de projets
              personnels aux applications professionnelles. Chaque projet
              reflète ma passion pour le développement et l&apos;innovation
              technologique.
            </p>
          </div>

          {/* Filtres */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-foreground text-background"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                  }`}
                >
                  {category === "all" ? "Tous les projets" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {projects.length}
                </div>
                <div className="text-foreground/60">Projets totaux</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {projects.filter((p) => p.status === "completed").length}
                </div>
                <div className="text-foreground/60">Terminés</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {projects.filter((p) => p.status === "in_progress").length}
                </div>
                <div className="text-foreground/60">En cours</div>
              </div>
            </div>
          </div>

          {/* Grille des projets */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">
                Aucun projet trouvé pour cette catégorie.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voir tous les projets
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
