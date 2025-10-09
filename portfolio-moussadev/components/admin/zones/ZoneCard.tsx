"use client";

import { Zone } from "@/types/api";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { MdDragIndicator } from "react-icons/md";
import { FiTarget } from "react-icons/fi";
import Link from "next/link";

interface ZoneCardProps {
  zone: Zone;
  projectId: string;
  onEdit: (zone: Zone) => void;
  onDelete: (zoneId: string) => void;
  isDraggable?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

export function ZoneCard({
  zone,
  projectId,
  onEdit,
  onDelete,
  isDraggable = true,
  dragHandleProps,
}: ZoneCardProps) {
  return (
    <div className="relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              {...dragHandleProps}
            >
              <MdDragIndicator className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-semibold flex-shrink-0">
                {zone.order}
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {zone.name}
              </h3>
            </div>
            {zone.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {zone.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/quests?projectId=${projectId}&zoneId=${zone.id}`}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 rounded-md transition-colors"
            aria-label="Gérer les quêtes de la zone"
          >
            <FiTarget className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onEdit(zone)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            aria-label="Éditer la zone"
          >
            <HiPencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(zone.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
            aria-label="Supprimer la zone"
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700 gap-2 sm:gap-0">
        <span>
          {zone.quests?.length || 0} quête
          {(zone.quests?.length || 0) !== 1 ? "s" : ""}
        </span>
        <span className="text-xs">
          Créée le {new Date(zone.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  );
}
