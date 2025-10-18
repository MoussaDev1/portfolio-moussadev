"use client";

import { useState } from "react";
import { Project, ProjectType, ProjectStatus } from "@/types/api";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Castle,
  Building2,
  Calendar,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onRefresh: () => void;
}

export default function ProjectsList({
  projects,
  onSelectProject,
  onEditProject,
  onRefresh,
}: ProjectsListProps) {
  const [filter, setFilter] = useState<"all" | ProjectType | ProjectStatus>(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    project: Project | null;
  }>({ open: false, project: null });

  const { mutate: deleteProject, loading: deleting } = useMutation(
    (id: string) => apiClient.deleteProject(id),
    {
      onSuccess: () => {
        setDeleteDialog({ open: false, project: null });
        onRefresh();
      },
    },
  );

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === project.type || filter === project.status) return true;

    return false;
  });

  const handleDeleteClick = (project: Project) => {
    setDeleteDialog({ open: true, project });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.project) {
      await deleteProject(deleteDialog.project.id);
    }
  };

  const getStatusVariant = (
    status: ProjectStatus,
  ): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
      [ProjectStatus.PLANNING]: "secondary" as const,
      [ProjectStatus.ACTIVE]: "default" as const,
      [ProjectStatus.COMPLETED]: "outline" as const,
      [ProjectStatus.PAUSED]: "destructive" as const,
    };
    return variants[status] || "secondary";
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      [ProjectStatus.PLANNING]: "Planning",
      [ProjectStatus.ACTIVE]: "En Cours",
      [ProjectStatus.COMPLETED]: "Terminé",
      [ProjectStatus.PAUSED]: "En Pause",
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type: ProjectType) => {
    return type === ProjectType.ZONE_SYSTEM ? (
      <Castle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    ) : (
      <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Filtres et Recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrer par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              <SelectItem value={ProjectType.ZONE_SYSTEM}>
                Zone System
              </SelectItem>
              <SelectItem value={ProjectType.FLOOR_SYSTEM}>
                Floor System
              </SelectItem>
              <SelectItem value={ProjectStatus.PLANNING}>Planning</SelectItem>
              <SelectItem value={ProjectStatus.ACTIVE}>En Cours</SelectItem>
              <SelectItem value={ProjectStatus.COMPLETED}>Terminés</SelectItem>
              <SelectItem value={ProjectStatus.PAUSED}>En Pause</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des Projets */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                {searchTerm || filter !== "all"
                  ? "Aucun projet ne correspond aux critères."
                  : "Aucun projet trouvé."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                    {/* Contenu principal */}
                    <div className="flex-1 space-y-3">
                      {/* Header avec titre et statut */}
                      <div className="flex items-start gap-3 flex-wrap">
                        {getTypeIcon(project.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-1 break-words">
                            {project.title}
                          </h3>
                          <Badge variant={getStatusVariant(project.status)}>
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge
                                key={tech.technology.id}
                                variant="secondary"
                              >
                                {tech.technology.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Castle className="h-4 w-4" />
                          {project.zones?.length || 0} zones
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {project.floors?.length || 0} floors
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(project.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 justify-end">
                      <Button
                        onClick={() => onSelectProject(project)}
                        variant="default"
                        size="sm"
                        className="flex-1 lg:flex-none"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Gérer
                      </Button>
                      <Button
                        onClick={() => onEditProject(project)}
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(project)}
                        variant="destructive"
                        size="sm"
                        disabled={deleting}
                        className="flex-1 lg:flex-none"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !deleting && setDeleteDialog({ open, project: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le projet{" "}
              <strong>&quot;{deleteDialog.project?.title}&quot;</strong> ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, project: null })}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
