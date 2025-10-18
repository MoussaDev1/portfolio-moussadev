import { FloorQuest, QuestStatus, Priority } from "@/types/api";
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
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorQuestCardProps {
  floorQuest: FloorQuest;
  onEdit: (floorQuest: FloorQuest) => void;
  onDelete: (floorQuestId: string) => void;
  dragHandleProps?: Record<string, unknown>;
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
    label: "Terminée",
    variant: "outline" as const,
    icon: CheckCircle,
  },
  [QuestStatus.BLOCKED]: {
    label: "Bloquée",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
};

const priorityConfig = {
  [Priority.LOW]: { label: "Basse", borderColor: "border-l-gray-400" },
  [Priority.MEDIUM]: { label: "Moyenne", borderColor: "border-l-blue-500" },
  [Priority.HIGH]: { label: "Haute", borderColor: "border-l-orange-500" },
  [Priority.CRITICAL]: { label: "Critique", borderColor: "border-l-red-500" },
};

export function FloorQuestCard({
  floorQuest,
  onEdit,
  onDelete,
  dragHandleProps,
}: FloorQuestCardProps) {
  const statusInfo = statusConfig[floorQuest.status];
  const priorityInfo = priorityConfig[floorQuest.priority];
  const StatusIcon = statusInfo.icon;

  const hasDoD =
    floorQuest.definitionOfDone && floorQuest.definitionOfDone.length > 0;
  const hasTests = floorQuest.manualTests && floorQuest.manualTests.length > 0;
  const hasTechDebt =
    floorQuest.technicalDebt && floorQuest.technicalDebt.trim().length > 0;

  return (
    <Card
      className={cn(
        "group border-l-4 hover:shadow-lg transition-all",
        priorityInfo.borderColor,
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2 break-words">
                  {floorQuest.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={statusInfo.variant}
                    className="inline-flex items-center gap-1"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                  <Badge variant="outline" className="flex-shrink-0">
                    {priorityInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(floorQuest)}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  aria-label="Éditer la floor quest"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(floorQuest.id)}
                  className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
                  aria-label="Supprimer la floor quest"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Story */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {floorQuest.userStory}
            </p>

            {/* Acceptance Criteria */}
            {floorQuest.acceptanceCriteria && (
              <div className="mb-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">
                  Critères d&apos;acceptation:
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {floorQuest.acceptanceCriteria}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t gap-2 sm:gap-0">
              <div className="flex items-center gap-3 flex-wrap">
                {hasDoD && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    DoD ({floorQuest.definitionOfDone?.length})
                  </span>
                )}
                {hasTests && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Tests ({floorQuest.manualTests?.length})
                  </span>
                )}
                {hasTechDebt && (
                  <span className="flex items-center gap-1 text-orange-500">
                    <AlertCircle className="h-3 w-3" />
                    Dette
                  </span>
                )}
                {floorQuest.estimatedPomodoros && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {floorQuest.estimatedPomodoros}p
                    {floorQuest.actualPomodoros &&
                      ` / ${floorQuest.actualPomodoros}p`}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                Ordre: {floorQuest.order}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
