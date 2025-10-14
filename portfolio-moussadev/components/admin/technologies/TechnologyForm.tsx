"use client";

import { useState, useEffect } from "react";
import {
  Technology,
  CreateTechnologyDto,
  TechCategory,
  TechStatus,
} from "@/types/technology";
import { generateSlug } from "@/lib/utils";

interface TechnologyFormProps {
  technology?: Technology | null;
  onSubmit: (data: CreateTechnologyDto) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = [
  { value: TechCategory.LANGUAGES, label: "💬 Langages" },
  { value: TechCategory.FRAMEWORKS, label: "🏗️ Frameworks" },
  { value: TechCategory.LIBRARIES, label: "📚 Librairies" },
  { value: TechCategory.TOOLS, label: "🔧 Outils" },
  { value: TechCategory.PLATFORMS, label: "🌐 Plateformes" },
  { value: TechCategory.DATABASES, label: "🗄️ Bases de données" },
  { value: TechCategory.DEVOPS, label: "⚙️ DevOps" },
];

const STATUS_OPTIONS = [
  { value: TechStatus.MASTERED, label: "🟢 Maîtrisée" },
  { value: TechStatus.LEARNING, label: "🔵 En apprentissage" },
  { value: TechStatus.TO_REVIEW, label: "🟡 À revoir" },
  { value: TechStatus.EXPLORING, label: "🟣 Exploration" },
  { value: TechStatus.DEPRECATED, label: "⚫ Obsolète" },
];

export default function TechnologyForm({
  technology,
  onSubmit,
  onCancel,
}: TechnologyFormProps) {
  const [formData, setFormData] = useState<CreateTechnologyDto>({
    name: "",
    slug: "",
    category: TechCategory.LANGUAGES,
    status: TechStatus.LEARNING,
    description: "",
    iconUrl: "",
    websiteUrl: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTechnologyDto, string>>
  >({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (technology) {
      setFormData({
        name: technology.name,
        slug: technology.slug,
        category: technology.category,
        status: technology.status,
        description: technology.description || "",
        iconUrl: technology.iconUrl || "",
        websiteUrl: technology.websiteUrl || "",
      });
      setSlugManuallyEdited(true);
    }
  }, [technology]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSlugChange = (slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
    setSlugManuallyEdited(true);
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTechnologyDto, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est requis";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets";
    }
    if (formData.websiteUrl && !formData.websiteUrl.startsWith("http")) {
      newErrors.websiteUrl = "L'URL doit commencer par http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Nettoyer les champs optionnels vides
      const cleanedData = {
        ...formData,
        description: formData.description?.trim() || undefined,
        iconUrl: formData.iconUrl?.trim() || undefined,
        websiteUrl: formData.websiteUrl?.trim() || undefined,
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nom de la technologie <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ex: TypeScript, React, PostgreSQL..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? "border-red-500" : "border-border"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="Ex: typescript, react, postgresql"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.slug ? "border-red-500" : "border-border"
          }`}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
        )}
        <p className="text-sm text-foreground/60 mt-1">
          Généré automatiquement à partir du nom. Uniquement lettres minuscules,
          chiffres et tirets.
        </p>
      </div>

      {/* Catégorie & Statut (côte à côte) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value as TechCategory,
              }))
            }
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Statut <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as TechStatus,
              }))
            }
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Décrivez cette technologie, votre expérience avec elle..."
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* URL icône */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          URL de l&apos;icône
        </label>
        <input
          type="url"
          value={formData.iconUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))
          }
          placeholder="https://example.com/icon.svg"
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-foreground/60 mt-1">
          URL publique de l&apos;icône/logo de la technologie
        </p>
      </div>

      {/* URL site web */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Site web officiel
        </label>
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
          }
          placeholder="https://www.example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.websiteUrl ? "border-red-500" : "border-border"
          }`}
        />
        {errors.websiteUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {technology ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  );
}
