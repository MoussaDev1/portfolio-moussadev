"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Radar, Loader2, FolderOpen, ExternalLink } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Technology, TechCategory, TechStatus } from "@/types/technology";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_LABELS = {
  [TechCategory.LANGUAGES]: "Langages",
  [TechCategory.FRAMEWORKS]: "Frameworks",
  [TechCategory.LIBRARIES]: "Librairies",
  [TechCategory.TOOLS]: "Outils",
  [TechCategory.PLATFORMS]: "Plateformes",
  [TechCategory.DATABASES]: "Bases de données",
  [TechCategory.DEVOPS]: "DevOps",
};

const STATUS_LABELS = {
  [TechStatus.MASTERED]: "Maîtrisée",
  [TechStatus.LEARNING]: "En apprentissage",
  [TechStatus.TO_REVIEW]: "À revoir",
  [TechStatus.EXPLORING]: "Exploration",
  [TechStatus.DEPRECATED]: "Obsolète",
};

export default function TechRadarPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const loadTechnologies = async () => {
    try {
      setLoading(true);

      const filters: { category?: string; status?: string } = {};
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedStatus !== "all") filters.status = selectedStatus;

      const data = await apiClient.getTechnologies(filters);

      // Filtrer les technologies obsolètes en public (optionnel)
      const filteredData = data.filter(
        (tech) => tech.status !== TechStatus.DEPRECATED,
      );
      setTechnologies(filteredData);
    } catch (error) {
      console.error("Erreur lors du chargement des technologies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnologies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedStatus]);

  // Organiser par catégorie pour un affichage en radar
  const technologiesByCategory = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<TechCategory, Technology[]>,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radar className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Mon Tech Radar
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les technologies que j&apos;explore, maîtrise et utilise
            dans mes projets. Un aperçu de mon évolution technique et de mes
            domaines d&apos;expertise.
          </p>
        </div>

        {/* Filtres */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Catégorie */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Filtrer par catégorie
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Filtrer par niveau
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies par catégorie */}
        <div className="space-y-12">
          {Object.entries(technologiesByCategory).map(([category, techs]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-1 h-8 bg-primary rounded"></span>
                {CATEGORY_LABELS[category as TechCategory]}
                <span className="text-lg font-normal text-muted-foreground">
                  ({techs.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techs.map((tech) => (
                  <Card
                    key={tech.id}
                    className="hover:border-primary/50 transition-all duration-200 hover:shadow-lg group"
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {tech.iconUrl ? (
                            <Image
                              src={tech.iconUrl}
                              alt={tech.name}
                              width={48}
                              height={48}
                              className="rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xl">
                                {tech.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {tech.name}
                            </h3>
                            {tech.websiteUrl && (
                              <a
                                href={tech.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                              >
                                Site officiel
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <Badge
                          variant={
                            tech.status === TechStatus.MASTERED
                              ? "default"
                              : tech.status === TechStatus.LEARNING
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            tech.status === TechStatus.MASTERED
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                              : tech.status === TechStatus.LEARNING
                                ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                                : tech.status === TechStatus.EXPLORING
                                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
                                  : tech.status === TechStatus.TO_REVIEW
                                    ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                    : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                          }
                        >
                          {STATUS_LABELS[tech.status]}
                        </Badge>
                      </div>

                      {/* Description */}
                      {tech.description && (
                        <p className="text-sm text-foreground/70 mb-4">
                          {tech.description}
                        </p>
                      )}

                      {/* Projets et articles liés */}
                      <div className="space-y-3">
                        {tech.projects.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Projets utilisant cette technologie :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tech.projects.slice(0, 3).map((projectTech) => (
                                <Link
                                  key={projectTech.project.id}
                                  href={`/projects/${projectTech.project.slug}`}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="hover:bg-secondary/80 transition-colors cursor-pointer"
                                  >
                                    {projectTech.project.title}
                                  </Badge>
                                </Link>
                              ))}
                              {tech.projects.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{tech.projects.length - 3} autres
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {tech.posts.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Articles connexes :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tech.posts
                                .filter((p) => p.post.published)
                                .slice(0, 2)
                                .map((postTech) => (
                                  <Link
                                    key={postTech.post.id}
                                    href={`/blog/${postTech.post.slug}`}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
                                    >
                                      {postTech.post.title}
                                    </Badge>
                                  </Link>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {technologies.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Aucune technologie trouvée avec ces filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
