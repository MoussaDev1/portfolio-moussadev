"use client";

import { useState, useEffect } from "react";
import { FloorQuest, QuestStatus, Priority } from "@/types/api";
import { CreateFloorQuestDto, UpdateFloorQuestDto } from "@/types/forms";
import { HiX } from "react-icons/hi";
import clsx from "clsx";

interface FloorQuestFormProps {
  floorQuest?: FloorQuest;
  projectId: string;
  floorId: string;
  existingFloorQuests: FloorQuest[];
  onSubmit: (data: CreateFloorQuestDto | UpdateFloorQuestDto) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function FloorQuestForm({
  floorQuest,
  existingFloorQuests,
  onSubmit,
  onCancel,
  isLoading,
}: FloorQuestFormProps) {
  const isEditing = !!floorQuest;

  const [title, setTitle] = useState(floorQuest?.title || "");
  const [userStory, setUserStory] = useState(floorQuest?.userStory || "");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    floorQuest?.acceptanceCriteria || ""
  );
  const [definitionOfDone, setDefinitionOfDone] = useState(
    floorQuest?.definitionOfDone?.join("\n") || ""
  );
  const [manualTests, setManualTests] = useState(
    floorQuest?.manualTests?.join("\n") || ""
  );
  const [technicalDebt, setTechnicalDebt] = useState(
    floorQuest?.technicalDebt || ""
  );
  const [status, setStatus] = useState<QuestStatus>(
    floorQuest?.status || QuestStatus.TODO
  );
  const [priority, setPriority] = useState<Priority>(
    floorQuest?.priority || Priority.MEDIUM
  );
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    floorQuest?.estimatedPomodoros?.toString() || ""
  );
  const [actualPomodoros, setActualPomodoros] = useState(
    floorQuest?.actualPomodoros?.toString() || ""
  );
  const [order, setOrder] = useState(
    floorQuest?.order || existingFloorQuests.length + 1
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculer l'ordre pour les nouvelles quêtes
  useEffect(() => {
    if (!isEditing) {
      const maxOrder = Math.max(0, ...existingFloorQuests.map((q) => q.order));
      setOrder(maxOrder + 1);
    }
  }, [existingFloorQuests, isEditing]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (title.trim().length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!userStory.trim()) {
      newErrors.userStory = "La user story est requise";
    } else if (userStory.trim().length < 10) {
      newErrors.userStory =
        "La user story doit contenir au moins 10 caractères";
    }

    if (order < 1) {
      newErrors.order = "L'ordre doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Convertir les strings en tableaux (une ligne = un item)
    const dodArray = definitionOfDone
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const testsArray = manualTests
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (isEditing) {
      const data: UpdateFloorQuestDto = {
        title: title.trim(),
        userStory: userStory.trim(),
        acceptanceCriteria: acceptanceCriteria.trim() || undefined,
        definitionOfDone: dodArray.length > 0 ? dodArray : undefined,
        manualTests: testsArray.length > 0 ? testsArray : undefined,
        technicalDebt: technicalDebt.trim() || undefined,
        status,
        priority,
        estimatedPomodoros: estimatedPomodoros
          ? parseInt(estimatedPomodoros)
          : undefined,
        actualPomodoros: actualPomodoros
          ? parseInt(actualPomodoros)
          : undefined,
        order,
      };
      await onSubmit(data);
    } else {
      const data: CreateFloorQuestDto = {
        title: title.trim(),
        userStory: userStory.trim(),
        acceptanceCriteria: acceptanceCriteria.trim() || undefined,
        definitionOfDone: dodArray.length > 0 ? dodArray : undefined,
        manualTests: testsArray.length > 0 ? testsArray : undefined,
        technicalDebt: technicalDebt.trim() || undefined,
        priority,
        estimatedPomodoros: estimatedPomodoros
          ? parseInt(estimatedPomodoros)
          : undefined,
        order,
      };
      await onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Éditer" : "Nouvelle"} Floor Quest
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={clsx(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white",
                errors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
              placeholder="Ex: Implémenter l'authentification utilisateur"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* User Story */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User Story <span className="text-red-500">*</span>
            </label>
            <textarea
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              rows={3}
              className={clsx(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white",
                errors.userStory
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
              placeholder="En tant que [rôle], je veux [action] afin de [bénéfice]"
            />
            {errors.userStory && (
              <p className="mt-1 text-sm text-red-500">{errors.userStory}</p>
            )}
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Critères d&apos;acceptation
            </label>
            <textarea
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Conditions que doit respecter la fonctionnalité"
            />
          </div>

          {/* Definition of Done */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Definition of Done (un critère par ligne)
            </label>
            <textarea
              value={definitionOfDone}
              onChange={(e) => setDefinitionOfDone(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Code testé et fonctionnel&#10;Documentation mise à jour&#10;Tests unitaires passent"
            />
          </div>

          {/* Manual Tests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tests manuels (un test par ligne)
            </label>
            <textarea
              value={manualTests}
              onChange={(e) => setManualTests(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Vérifier la connexion avec un compte valide&#10;Tester l'affichage responsive&#10;Valider les messages d'erreur"
            />
          </div>

          {/* Technical Debt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dette technique
            </label>
            <textarea
              value={technicalDebt}
              onChange={(e) => setTechnicalDebt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Problèmes à résoudre plus tard, refactoring nécessaire, etc."
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuestStatus)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={QuestStatus.TODO}>À faire</option>
                <option value={QuestStatus.IN_PROGRESS}>En cours</option>
                <option value={QuestStatus.TESTING}>Tests</option>
                <option value={QuestStatus.DONE}>Terminée</option>
                <option value={QuestStatus.BLOCKED}>Bloquée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={Priority.LOW}>Basse</option>
                <option value={Priority.MEDIUM}>Moyenne</option>
                <option value={Priority.HIGH}>Haute</option>
                <option value={Priority.CRITICAL}>Critique</option>
              </select>
            </div>
          </div>

          {/* Estimated & Actual Pomodoros */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pomodoros estimés
              </label>
              <input
                type="number"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pomodoros réels
                </label>
                <input
                  type="number"
                  value={actualPomodoros}
                  onChange={(e) => setActualPomodoros(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ordre
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min="1"
              disabled={!isEditing}
              className={clsx(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white",
                !isEditing && "opacity-50 cursor-not-allowed",
                errors.order
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              )}
            />
            {!isEditing && (
              <p className="mt-1 text-sm text-gray-500">
                L&apos;ordre est automatiquement calculé pour les nouvelles
                quêtes
              </p>
            )}
            {errors.order && (
              <p className="mt-1 text-sm text-red-500">{errors.order}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading
                ? "Enregistrement..."
                : isEditing
                ? "Mettre à jour"
                : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
