"use client";

import Image from "next/image";
import { Technology, TechStatus, TechCategory } from "@/types/technology";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  ExternalLink,
  FolderKanban,
  FileText,
  Sparkles,
} from "lucide-react";

interface TechnologyCardProps {
  technology: Technology;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  [TechStatus.MASTERED]: { label: "Maîtrisée", variant: "outline" as const },
  [TechStatus.LEARNING]: {
    label: "En apprentissage",
    variant: "default" as const,
  },
  [TechStatus.TO_REVIEW]: { label: "À revoir", variant: "secondary" as const },
  [TechStatus.EXPLORING]: { label: "Exploration", variant: "outline" as const },
  [TechStatus.DEPRECATED]: {
    label: "Obsolète",
    variant: "destructive" as const,
  },
};

const CATEGORY_LABELS = {
  [TechCategory.LANGUAGES]: "Langages",
  [TechCategory.FRAMEWORKS]: "Frameworks",
  [TechCategory.LIBRARIES]: "Librairies",
  [TechCategory.TOOLS]: "Outils",
  [TechCategory.PLATFORMS]: "Plateformes",
  [TechCategory.DATABASES]: "Bases de données",
  [TechCategory.DEVOPS]: "DevOps",
};

export default function TechnologyCard({
  technology,
  onEdit,
  onDelete,
}: TechnologyCardProps) {
  const statusInfo = STATUS_CONFIG[technology.status];

  const handleDelete = () => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer "${technology.name}" ?\n\nCette action est irréversible.`,
      )
    ) {
      onDelete(technology.id);
    }
  };

  return (
    <Card className="group border-2 hover:border-primary/50 transition-all hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Icon */}
            {technology.iconUrl ? (
              <Image
                src={technology.iconUrl}
                alt={technology.name}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            {/* Name & Slug */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold break-words">
                {technology.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {technology.slug}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(technology)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Éditer la technologie"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
              aria-label="Supprimer la technologie"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {technology.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {technology.description}
          </p>
        )}

        {/* Badges : Catégorie & Statut */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex-shrink-0">
            {CATEGORY_LABELS[technology.category]}
          </Badge>
          <Badge variant={statusInfo.variant} className="flex-shrink-0">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Relations & Website */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t gap-2 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <FolderKanban className="h-3 w-3" />
              {technology.projects?.length || 0} projet
              {(technology.projects?.length || 0) > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {technology.posts?.length || 0} article
              {(technology.posts?.length || 0) > 1 ? "s" : ""}
            </span>
          </div>
          {technology.websiteUrl && (
            <a
              href={technology.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              Site
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
