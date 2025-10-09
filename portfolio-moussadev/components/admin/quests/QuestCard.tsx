"use client";

import { Quest, QuestStatus, Priority } from "@/types/api";
import {
  HiPencil,
  HiTrash,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi2";
import clsx from "clsx";

interface QuestCardProps {
  quest: Quest;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStatusChange?: (questId: string, status: QuestStatus) => void;
}

const statusConfig = {
  [QuestStatus.TODO]: {
    label: "À faire",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    icon: HiExclamationCircle,
  },
  [QuestStatus.IN_PROGRESS]: {
    label: "En cours",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: HiClock,
  },
  [QuestStatus.TESTING]: {
    label: "Tests",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: HiExclamationCircle,
  },
  [QuestStatus.DONE]: {
    label: "Terminé",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: HiCheckCircle,
  },
  [QuestStatus.BLOCKED]: {
    label: "Bloqué",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: HiExclamationCircle,
  },
};

const priorityConfig = {
  [Priority.LOW]: {
    label: "Basse",
    color: "border-gray-300 dark:border-gray-600",
  },
  [Priority.MEDIUM]: {
    label: "Moyenne",
    color: "border-blue-300 dark:border-blue-600",
  },
  [Priority.HIGH]: {
    label: "Haute",
    color: "border-orange-300 dark:border-orange-600",
  },
  [Priority.CRITICAL]: {
    label: "Critique",
    color: "border-red-300 dark:border-red-600",
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
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6",
        priorityInfo.color
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {quest.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {priorityInfo.label}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {quest.userStory}
          </p>

          {/* Status Badge */}
          <button
            onClick={handleStatusClick}
            className={clsx(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
              statusInfo.color,
              onStatusChange && "hover:opacity-80 cursor-pointer"
            )}
            disabled={!onStatusChange}
          >
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(quest)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            aria-label="Éditer la quest"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(quest.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
            aria-label="Supprimer la quest"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Definition of Done & Tests */}
      {quest.definitionOfDone && quest.definitionOfDone.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Definition of Done ({quest.definitionOfDone.length} critères)
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="line-clamp-2">{quest.definitionOfDone.join(" • ")}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {quest.estimatedPomodoros && (
            <span className="flex items-center gap-1">
              <HiClock className="h-3 w-3" />
              {quest.estimatedPomodoros} pomodoros estimé
            </span>
          )}
          {quest.actualPomodoros && (
            <span className="flex items-center gap-1">
              <HiCheckCircle className="h-3 w-3" />
              {quest.actualPomodoros} pomodoros réel
            </span>
          )}
        </div>
        <span>
          Créée le {new Date(quest.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  );
}
