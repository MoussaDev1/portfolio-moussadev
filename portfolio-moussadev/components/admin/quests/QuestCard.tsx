"use client";

import { Quest, QuestStatus, Priority } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStatusChange?: (questId: string, status: QuestStatus) => void;
}

const statusConfig = {
  [QuestStatus.TODO]: {
    label: "À faire",
    variant: "secondary" as const,
    icon: AlertCircle,
  },
  [QuestStatus.IN_PROGRESS]: {
    label: "En cours",
    variant: "default" as const,
    icon: Clock,
  },
  [QuestStatus.TESTING]: {
    label: "Tests",
    variant: "outline" as const,
    icon: Target,
  },
  [QuestStatus.DONE]: {
    label: "Terminé",
    variant: "outline" as const,
    icon: CheckCircle,
  },
  [QuestStatus.BLOCKED]: {
    label: "Bloqué",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
};

const priorityConfig = {
  [Priority.LOW]: {
    label: "Basse",
    borderColor: "border-l-gray-400",
  },
  [Priority.MEDIUM]: {
    label: "Moyenne",
    borderColor: "border-l-blue-500",
  },
  [Priority.HIGH]: {
    label: "Haute",
    borderColor: "border-l-orange-500",
  },
  [Priority.CRITICAL]: {
    label: "Critique",
    borderColor: "border-l-red-500",
  },
};

export function QuestCard({
  quest,
  onEdit,
  onDelete,
  onStatusChange,
}: QuestCardProps) {
  const statusInfo = statusConfig[quest.status];
  const priorityInfo = priorityConfig[quest.priority];
  const StatusIcon = statusInfo.icon;

  const handleStatusClick = () => {
    if (!onStatusChange) return;

    // Cycle through statuses
    const statusOrder = [
      QuestStatus.TODO,
      QuestStatus.IN_PROGRESS,
      QuestStatus.TESTING,
      QuestStatus.DONE,
    ];
    const currentIndex = statusOrder.indexOf(quest.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(quest.id, nextStatus);
  };

  return (
    <Card
      className={cn(
        "group border-l-4 hover:shadow-lg transition-all",
        priorityInfo.borderColor,
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold break-words">
                {quest.title}
              </h3>
              <Badge variant="outline" className="flex-shrink-0">
                {priorityInfo.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {quest.userStory}
            </p>

            {/* Status Badge */}
            <Badge
              variant={statusInfo.variant}
              className={cn(
                "inline-flex items-center gap-1",
                onStatusChange && "cursor-pointer hover:opacity-80",
              )}
              onClick={onStatusChange ? handleStatusClick : undefined}
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(quest)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Éditer la quest"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(quest.id)}
              className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
              aria-label="Supprimer la quest"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Definition of Done & Tests */}
        {quest.definitionOfDone && quest.definitionOfDone.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              Definition of Done ({quest.definitionOfDone.length} critères)
            </h4>
            <div className="text-xs text-muted-foreground">
              <p className="line-clamp-2">
                {quest.definitionOfDone.join(" • ")}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t gap-2 sm:gap-0">
          <div className="flex items-center gap-4 flex-wrap">
            {quest.estimatedPomodoros && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {quest.estimatedPomodoros} estimé
              </span>
            )}
            {quest.actualPomodoros && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {quest.actualPomodoros} réel
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            {new Date(quest.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
