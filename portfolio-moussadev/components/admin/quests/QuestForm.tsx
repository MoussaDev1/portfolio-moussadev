"use client";

import { useState, useEffect } from "react";
import { Quest, QuestStatus, Priority } from "@/types/api";
import { CreateZoneQuestDto, UpdateZoneQuestDto } from "@/types/forms";
import { HiX } from "react-icons/hi";
import clsx from "clsx";

interface QuestFormProps {
  quest?: Quest;
  zoneId: string;
  projectId: string;
  onSubmit: (data: CreateZoneQuestDto | UpdateZoneQuestDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  {
    value: QuestStatus.TODO,
    label: "À faire",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: QuestStatus.IN_PROGRESS,
    label: "En cours",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: QuestStatus.TESTING,
    label: "En test",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: QuestStatus.DONE,
    label: "Terminé",
    color: "bg-green-100 text-green-800",
  },
  {
    value: QuestStatus.BLOCKED,
    label: "Bloqué",
    color: "bg-red-100 text-red-800",
  },
];

const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: "Basse", color: "bg-gray-100 text-gray-800" },
  {
    value: Priority.MEDIUM,
    label: "Moyenne",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: Priority.HIGH,
    label: "Haute",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: Priority.CRITICAL,
    label: "Critique",
    color: "bg-red-100 text-red-800",
  },
];

// Fonctions utilitaires pour convertir entre arrays et strings
const arrayToString = (arr: string[] | undefined): string => {
  return arr ? arr.join("\n") : "";
};

const stringToArray = (str: string): string[] => {
  return str.trim()
    ? str
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    : [];
};

export function QuestForm({
  quest,
  zoneId,
  projectId,
  onSubmit,
  onCancel,
  isLoading = false,
}: QuestFormProps) {
  const [formData, setFormData] = useState({
    title: quest?.title || "",
    userStory: quest?.userStory || "",
    definitionOfDone: arrayToString(quest?.definitionOfDone),
    manualTests: arrayToString(quest?.manualTests),
    techDebt: quest?.technicalDebt || "",
    status: quest?.status || QuestStatus.TODO,
    priority: quest?.priority || Priority.MEDIUM,
    estimatedHours: quest?.estimatedPomodoros || undefined,
    actualHours: quest?.actualPomodoros || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quest) {
      setFormData({
        title: quest.title,
        userStory: quest.userStory,
        definitionOfDone: arrayToString(quest.definitionOfDone),
        manualTests: arrayToString(quest.manualTests),
        techDebt: quest.technicalDebt || "",
        status: quest.status,
        priority: quest.priority,
        estimatedHours: quest.estimatedPomodoros || undefined,
        actualHours: quest.actualPomodoros || undefined,
      });
    }
  }, [quest]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.userStory.trim()) {
      newErrors.userStory = "L'user story est requise";
    }

    if (formData.estimatedHours && formData.estimatedHours < 1) {
      newErrors.estimatedHours = "L'estimation doit être supérieure à 0";
    }

    if (formData.actualHours && formData.actualHours < 0) {
      newErrors.actualHours =
        "Les heures réelles ne peuvent pas être négatives";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submitData = quest
        ? {
            // Mise à jour : exclure les champs non modifiables
            title: formData.title,
            userStory: formData.userStory,
            definitionOfDone: formData.definitionOfDone
              ? stringToArray(formData.definitionOfDone)
              : undefined,
            manualTests: formData.manualTests
              ? stringToArray(formData.manualTests)
              : undefined,
            techDebt: formData.techDebt || undefined,
            status: formData.status,
            priority: formData.priority,
            estimatedHours: formData.estimatedHours,
            actualHours: formData.actualHours,
          }
        : {
            // Création : inclure tous les champs nécessaires
            title: formData.title,
            userStory: formData.userStory,
            definitionOfDone: stringToArray(formData.definitionOfDone),
            manualTests: stringToArray(formData.manualTests),
            techDebt: formData.techDebt || undefined,
            priority: formData.priority,
            estimatedHours: formData.estimatedHours,
          };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "estimatedHours" || name === "actualHours"
          ? value
            ? parseInt(value) || 0
            : undefined
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {quest ? "Éditer la quête" : "Créer une nouvelle quête"}
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Titre de la quête *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={clsx(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                    errors.title
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  placeholder="Ex: Implémenter l'authentification utilisateur"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* User Story */}
              <div>
                <label
                  htmlFor="userStory"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  User Story *
                </label>
                <textarea
                  id="userStory"
                  name="userStory"
                  rows={3}
                  value={formData.userStory}
                  onChange={handleChange}
                  className={clsx(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                    errors.userStory
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  placeholder="En tant que [utilisateur], je veux [fonctionnalité] afin de [bénéfice]"
                  disabled={isLoading}
                />
                {errors.userStory && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.userStory}
                  </p>
                )}
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Priorité
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="estimatedHours"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Heures estimées
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    min="1"
                    value={formData.estimatedHours || ""}
                    onChange={handleChange}
                    className={clsx(
                      "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                      errors.estimatedHours
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    disabled={isLoading}
                  />
                  {errors.estimatedHours && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.estimatedHours}
                    </p>
                  )}
                </div>

                {quest && (
                  <div>
                    <label
                      htmlFor="actualHours"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Heures réelles
                    </label>
                    <input
                      type="number"
                      id="actualHours"
                      name="actualHours"
                      min="0"
                      value={formData.actualHours || ""}
                      onChange={handleChange}
                      className={clsx(
                        "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                        errors.actualHours
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                      disabled={isLoading}
                    />
                    {errors.actualHours && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.actualHours}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Definition of Done */}
              <div>
                <label
                  htmlFor="definitionOfDone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Definition of Done
                </label>
                <textarea
                  id="definitionOfDone"
                  name="definitionOfDone"
                  rows={4}
                  value={formData.definitionOfDone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Listez les critères d'acceptation (un par ligne)"
                  disabled={isLoading}
                />
                {errors.definitionOfDone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.definitionOfDone}
                  </p>
                )}
              </div>

              {/* Manual Tests */}
              <div>
                <label
                  htmlFor="manualTests"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tests manuels
                </label>
                <textarea
                  id="manualTests"
                  name="manualTests"
                  rows={4}
                  value={formData.manualTests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Listez les tests à effectuer (un par ligne)"
                  disabled={isLoading}
                />
                {errors.manualTests && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.manualTests}
                  </p>
                )}
              </div>

              {/* Tech Debt */}
              <div>
                <label
                  htmlFor="techDebt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Dette technique
                </label>
                <textarea
                  id="techDebt"
                  name="techDebt"
                  rows={3}
                  value={formData.techDebt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Notes sur la dette technique à résoudre..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                  {quest ? "Mise à jour..." : "Création..."}
                </span>
              ) : quest ? (
                "Mettre à jour"
              ) : (
                "Créer la quête"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
