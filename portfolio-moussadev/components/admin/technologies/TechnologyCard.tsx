"use client";

import { Technology, TechStatus, TechCategory } from "@/types/technology";
import {
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiPackage,
  FiFileText,
} from "react-icons/fi";

interface TechnologyCardProps {
  technology: Technology;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS = {
  [TechStatus.MASTERED]: "bg-green-100 text-green-800 border-green-200",
  [TechStatus.LEARNING]: "bg-blue-100 text-blue-800 border-blue-200",
  [TechStatus.TO_REVIEW]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [TechStatus.EXPLORING]: "bg-purple-100 text-purple-800 border-purple-200",
  [TechStatus.DEPRECATED]: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_LABELS = {
  [TechStatus.MASTERED]: "🟢 Maîtrisée",
  [TechStatus.LEARNING]: "🔵 En apprentissage",
  [TechStatus.TO_REVIEW]: "🟡 À revoir",
  [TechStatus.EXPLORING]: "🟣 Exploration",
  [TechStatus.DEPRECATED]: "⚫ Obsolète",
};

const CATEGORY_LABELS = {
  [TechCategory.LANGUAGES]: "💬 Langages",
  [TechCategory.FRAMEWORKS]: "🏗️ Frameworks",
  [TechCategory.LIBRARIES]: "📚 Librairies",
  [TechCategory.TOOLS]: "🔧 Outils",
  [TechCategory.PLATFORMS]: "🌐 Plateformes",
  [TechCategory.DATABASES]: "🗄️ Bases de données",
  [TechCategory.DEVOPS]: "⚙️ DevOps",
};

export default function TechnologyCard({
  technology,
  onEdit,
  onDelete,
}: TechnologyCardProps) {
  const handleDelete = () => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer "${technology.name}" ?\n\nCette action est irréversible.`
      )
    ) {
      onDelete(technology.id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-all duration-200">
      {/* Header avec icône et nom */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {technology.iconUrl ? (
            <img
              src={technology.iconUrl}
              alt={technology.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-2xl">
              🔹
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">
              {technology.name}
            </h3>
            <p className="text-sm text-foreground/60">{technology.slug}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(technology)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
            title="Modifier"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            title="Supprimer"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {technology.description && (
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
          {technology.description}
        </p>
      )}

      {/* Badges : Catégorie & Statut */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-3 py-1 bg-muted rounded-full text-foreground/80">
          {CATEGORY_LABELS[technology.category]}
        </span>
        <span
          className={`text-xs px-3 py-1 rounded-full border ${
            STATUS_COLORS[technology.status]
          }`}
        >
          {STATUS_LABELS[technology.status]}
        </span>
      </div>

      {/* Relations : Projets & Posts */}
      <div className="flex items-center gap-4 text-sm text-foreground/60 pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <FiPackage className="w-4 h-4" />
          <span>
            {technology.projects?.length || 0} projet
            {(technology.projects?.length || 0) > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FiFileText className="w-4 h-4" />
          <span>
            {technology.posts?.length || 0} article
            {(technology.posts?.length || 0) > 1 ? "s" : ""}
          </span>
        </div>
        {technology.websiteUrl && (
          <a
            href={technology.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-blue-600 hover:underline"
          >
            <FiExternalLink className="w-4 h-4" />
            Site
          </a>
        )}
      </div>
    </div>
  );
}
