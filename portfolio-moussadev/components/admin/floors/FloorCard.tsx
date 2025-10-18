"use client";

import { Floor } from "@/types/api";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Target,
  Edit,
  Trash2,
  GripVertical,
  Calendar,
} from "lucide-react";

interface FloorCardProps {
  floor: Floor;
  projectId: string;
  onEdit: (floor: Floor) => void;
  onDelete: (floorId: string) => void;
  isDraggable?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export function FloorCard({
  floor,
  projectId,
  onEdit,
  onDelete,
  isDraggable = true,
  dragHandleProps,
}: FloorCardProps) {
  return (
    <Card className="group border-2 hover:border-orange-500/50 transition-all hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1">
            {isDraggable && (
              <div
                className="cursor-grab active:cursor-grabbing opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                {...dragHandleProps}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 flex-shrink-0"
                >
                  Floor {floor.order}
                </Badge>
                <h3 className="text-lg sm:text-xl font-semibold break-words flex-1">
                  {floor.name}
                </h3>
              </div>
              {floor.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
                  {floor.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 sm:h-9 sm:w-9"
              asChild
            >
              <Link
                href={`/admin/floor-quests?projectId=${projectId}&floorId=${floor.id}`}
                aria-label="Gérer les quêtes du floor"
              >
                <Target className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(floor)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Éditer le floor"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(floor.id)}
              className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
              aria-label="Supprimer le floor"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t gap-2 sm:gap-0">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {floor.floorQuests?.length || 0} quête
            {(floor.floorQuests?.length || 0) !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            {new Date(floor.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
