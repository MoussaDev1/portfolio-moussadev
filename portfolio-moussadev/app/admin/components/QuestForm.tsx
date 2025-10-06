"use client";

import { useState } from "react";
import { useMutation } from "@/lib/hooks";
import { apiClient } from "@/lib/api";
import { Priority, CreateQuestDto } from "@/types/api";

interface QuestFormProps {
  zoneId?: string;
  floorId?: string;
  onQuestCreated: () => void;
  onCancel: () => void;
}

export default function QuestForm({
  zoneId,
  floorId,
  onQuestCreated,
  onCancel,
}: QuestFormProps) {
  const [formData, setFormData] = useState<CreateQuestDto>({
    title: "",
    userStory: "",
    acceptanceCriteria: "",
    definitionOfDone: "",
    manualTests: "",
    technicalDebt: "",
    priority: Priority.MEDIUM,
    estimatedPomodoros: 1,
    order: 1,
  });

  const {
    mutate: createQuest,
    loading,
    error,
  } = useMutation(async (data: CreateQuestDto) => {
    if (zoneId) {
      return await apiClient.createQuest(zoneId, data);
    } else if (floorId) {
      return await apiClient.createFloorQuest(floorId, data);
    }
    throw new Error("Zone ID ou Floor ID requis");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createQuest(formData);
      onQuestCreated();
      // Reset form
      setFormData({
        title: "",
        userStory: "",
        acceptanceCriteria: "",
        definitionOfDone: "",
        manualTests: "",
        technicalDebt: "",
        priority: Priority.MEDIUM,
        estimatedPomodoros: 1,
        order: 1,
      });
    } catch (err) {
      console.error("Error creating quest:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      [Priority.LOW]: "text-green-600 bg-green-100",
      [Priority.MEDIUM]: "text-blue-600 bg-blue-100",
      [Priority.HIGH]: "text-orange-600 bg-orange-100",
      [Priority.CRITICAL]: "text-red-600 bg-red-100",
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: Priority) => {
    const icons = {
      [Priority.LOW]: "🟢",
      [Priority.MEDIUM]: "🔵",
      [Priority.HIGH]: "🟠",
      [Priority.CRITICAL]: "🔴",
    };
    return icons[priority];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          ⚔️ Nouvelle Quête
          <span className="text-sm font-normal text-gray-500">
            {zoneId ? "Zone" : "Floor"} Quest
          </span>
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Titre */}
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              🎯 Titre de la Quête *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Créer l'interface de connexion"
            />
          </div>

          {/* Priorité */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              🚨 Priorité *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={Priority.LOW}>
                {getPriorityIcon(Priority.LOW)} Basse
              </option>
              <option value={Priority.MEDIUM}>
                {getPriorityIcon(Priority.MEDIUM)} Moyenne
              </option>
              <option value={Priority.HIGH}>
                {getPriorityIcon(Priority.HIGH)} Haute
              </option>
              <option value={Priority.CRITICAL}>
                {getPriorityIcon(Priority.CRITICAL)} Critique
              </option>
            </select>
            <div
              className={`mt-1 px-2 py-1 rounded text-xs inline-block ${getPriorityColor(
                formData.priority || Priority.MEDIUM
              )}`}
            >
              {getPriorityIcon(formData.priority || Priority.MEDIUM)}{" "}
              {formData.priority || Priority.MEDIUM}
            </div>
          </div>
        </div>

        {/* User Story */}
        <div>
          <label
            htmlFor="userStory"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            📖 User Story *
          </label>
          <textarea
            id="userStory"
            name="userStory"
            value={formData.userStory}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="En tant que [utilisateur], je veux [fonctionnalité] afin de [bénéfice]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Format recommandé: &quot;En tant que [qui], je veux [quoi] afin de
            [pourquoi]&quot;
          </p>
        </div>

        {/* Acceptance Criteria */}
        <div>
          <label
            htmlFor="acceptanceCriteria"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            ✅ Critères d&apos;Acceptation
          </label>
          <textarea
            id="acceptanceCriteria"
            name="acceptanceCriteria"
            value={formData.acceptanceCriteria}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="- Étant donné que..., quand..., alors...&#10;- L'utilisateur peut...&#10;- Le système doit..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Utilisez des puces (-) pour lister chaque critère. Format Gherkin
            recommandé.
          </p>
        </div>

        {/* Definition of Done */}
        <div>
          <label
            htmlFor="definitionOfDone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            🏁 Definition of Done (DoD) *
          </label>
          <textarea
            id="definitionOfDone"
            name="definitionOfDone"
            value={formData.definitionOfDone}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="- Code écrit et testé&#10;- Interface responsive&#10;- Documentation mise à jour&#10;- Pas de bug critique"
          />
          <p className="mt-1 text-xs text-gray-500">
            Critères que la quête doit respecter pour être considérée comme
            terminée.
          </p>
        </div>

        {/* Manual Tests */}
        <div>
          <label
            htmlFor="manualTests"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            🧪 Tests Manuels
          </label>
          <textarea
            id="manualTests"
            name="manualTests"
            value={formData.manualTests}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="1. Ouvrir la page de connexion&#10;2. Entrer des identifiants valides&#10;3. Cliquer sur se connecter&#10;4. Vérifier la redirection"
          />
          <p className="mt-1 text-xs text-gray-500">
            Étapes de test à suivre manuellement pour valider la fonctionnalité.
          </p>
        </div>

        {/* Technical Debt */}
        <div>
          <label
            htmlFor="technicalDebt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            ⚠️ Dette Technique
          </label>
          <textarea
            id="technicalDebt"
            name="technicalDebt"
            value={formData.technicalDebt}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Points d'amélioration ou problèmes techniques à traiter plus tard..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Problèmes connus, améliorations futures, ou optimisations à prévoir.
          </p>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pomodoros Estimés */}
          <div>
            <label
              htmlFor="estimatedPomodoros"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              🍅 Pomodoros Estimés
            </label>
            <input
              type="number"
              id="estimatedPomodoros"
              name="estimatedPomodoros"
              value={formData.estimatedPomodoros}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500">
              Estimation en sessions de 25-50 minutes
            </p>
          </div>

          {/* Ordre */}
          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              📊 Ordre d&apos;exécution
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500">
              Position dans la liste des quêtes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Création...
              </>
            ) : (
              <>⚔️ Créer la Quête</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
