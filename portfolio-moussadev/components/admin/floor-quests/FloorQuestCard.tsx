import { FloorQuest, QuestStatus, Priority } from "@/types/api";
import { HiPencil, HiTrash } from "react-icons/hi";
import { MdDragIndicator } from "react-icons/md";
import clsx from "clsx";

interface FloorQuestCardProps {
  floorQuest: FloorQuest;
  onEdit: (floorQuest: FloorQuest) => void;
  onDelete: (floorQuestId: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

const statusColors = {
  [QuestStatus.TODO]:
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  [QuestStatus.IN_PROGRESS]:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  [QuestStatus.TESTING]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  [QuestStatus.DONE]:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  [QuestStatus.BLOCKED]:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  [QuestStatus.TODO]: "À faire",
  [QuestStatus.IN_PROGRESS]: "En cours",
  [QuestStatus.TESTING]: "Tests",
  [QuestStatus.DONE]: "Terminée",
  [QuestStatus.BLOCKED]: "Bloquée",
};

const priorityColors = {
  [Priority.LOW]:
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  [Priority.MEDIUM]:
    "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  [Priority.HIGH]:
    "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
  [Priority.CRITICAL]:
    "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
};

const priorityLabels = {
  [Priority.LOW]: "Basse",
  [Priority.MEDIUM]: "Moyenne",
  [Priority.HIGH]: "Haute",
  [Priority.CRITICAL]: "Critique",
};

export function FloorQuestCard({
  floorQuest,
  onEdit,
  onDelete,
  dragHandleProps,
}: FloorQuestCardProps) {
  const statusColor = statusColors[floorQuest.status];
  const statusLabel = statusLabels[floorQuest.status];
  const priorityColor = priorityColors[floorQuest.priority];
  const priorityLabel = priorityLabels[floorQuest.priority];

  const hasDoD =
    floorQuest.definitionOfDone && floorQuest.definitionOfDone.length > 0;
  const hasTests = floorQuest.manualTests && floorQuest.manualTests.length > 0;
  const hasTechDebt =
    floorQuest.technicalDebt && floorQuest.technicalDebt.trim().length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
        >
          <MdDragIndicator className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header avec statut et priorité */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {floorQuest.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={clsx(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    statusColor
                  )}
                >
                  {statusLabel}
                </span>
                <span
                  className={clsx(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    priorityColor
                  )}
                >
                  🔥 {priorityLabel}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(floorQuest)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Éditer"
              >
                <HiPencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(floorQuest.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Supprimer"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Story */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {floorQuest.userStory}
          </p>

          {/* Acceptance Criteria */}
          {floorQuest.acceptanceCriteria && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Critères d&apos;acceptation:
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {floorQuest.acceptanceCriteria}
              </p>
            </div>
          )}

          {/* Footer avec badges */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {hasDoD && (
              <span className="flex items-center gap-1">
                ✅ DoD ({floorQuest.definitionOfDone?.length})
              </span>
            )}
            {hasTests && (
              <span className="flex items-center gap-1">
                🧪 Tests ({floorQuest.manualTests?.length})
              </span>
            )}
            {hasTechDebt && (
              <span className="flex items-center gap-1 text-orange-500">
                ⚠️ Dette technique
              </span>
            )}
            {floorQuest.estimatedPomodoros && (
              <span className="flex items-center gap-1">
                ⏱️ {floorQuest.estimatedPomodoros}p
                {floorQuest.actualPomodoros &&
                  ` / ${floorQuest.actualPomodoros}p`}
              </span>
            )}
            <span className="flex items-center gap-1">
              📍 Ordre: {floorQuest.order}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
