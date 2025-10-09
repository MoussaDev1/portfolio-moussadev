"use client";

import { useState, useEffect } from "react";
import { Zone } from "@/types/api";
import { CreateZoneDto, UpdateZoneDto } from "@/types/forms";
import { HiX } from "react-icons/hi";
import clsx from "clsx";

interface ZoneFormProps {
  zone?: Zone;
  projectId: string;
  existingZones?: Zone[];
  onSubmit: (data: CreateZoneDto | UpdateZoneDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ZoneForm({
  zone,
  projectId,
  existingZones = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ZoneFormProps) {
  const [formData, setFormData] = useState({
    name: zone?.name || "",
    description: zone?.description || "",
    order: zone?.order || 1,
    projectId: zone?.projectId || projectId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        description: zone.description || "",
        order: zone.order,
        projectId: zone.projectId,
      });
    } else {
      // Calculer le prochain ordre automatiquement pour une nouvelle zone
      const maxOrder =
        existingZones.length > 0
          ? Math.max(...existingZones.map((z) => z.order))
          : 0;
      const nextOrder = maxOrder + 1;

      setFormData((prev) => ({
        ...prev,
        order: nextOrder,
      }));
    }
  }, [zone, existingZones]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    if (formData.order < 1) {
      newErrors.order = "L'ordre doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Pour la mise à jour, on ne doit pas envoyer projectId
      const submitData = zone
        ? {
            name: formData.name,
            description: formData.description,
            order: formData.order,
          }
        : formData;

      await onSubmit(submitData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {zone ? "Éditer la zone" : "Créer une nouvelle zone"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
            aria-label="Fermer"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nom de la zone *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={clsx(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                errors.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
              placeholder="Ex: Interface utilisateur"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Description optionnelle de la zone..."
              disabled={isLoading}
            />
          </div>

          {/* Order */}
          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Ordre *
            </label>
            <input
              type="number"
              id="order"
              name="order"
              min="1"
              value={formData.order}
              onChange={handleChange}
              className={clsx(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                errors.order
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600",
                !zone && "bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              )}
              disabled={isLoading || !zone}
              readOnly={!zone}
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.order}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {zone
                ? "Ordre d'affichage de la zone dans le projet"
                : `Ordre automatique : ${formData.order} (après la dernière zone)`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {zone ? "Mise à jour..." : "Création..."}
                </span>
              ) : zone ? (
                "Mettre à jour"
              ) : (
                "Créer la zone"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
