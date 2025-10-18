"use client";

import { useState } from "react";
import { Quest, FloorQuest, QuestStatus, Priority } from "@/types/api";
import { useMutation } from "@/lib/hooks";
import { apiClient } from "@/lib/api";

interface QuestListProps {
  quests: (Quest | FloorQuest)[];
  onQuestUpdated: () => void;
  onCreateQuest: () => void;
  type: "zone" | "floor";
  projectId: string;
  zoneId?: string;
  floorId?: string;
}

export default function QuestList({
  quests,
  onQuestUpdated,
  onCreateQuest,
  type,
  projectId,
  zoneId,
  floorId,
}: QuestListProps) {
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | QuestStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");

  const { mutate: updateQuestStatus, loading: updatingStatus } = useMutation(
    async ({ questId, status }: { questId: string; status: QuestStatus }) => {
      if (type === "zone" && zoneId) {
        return await apiClient.updateZoneQuest(projectId, zoneId, questId, {
          status,
        });
      } else if (type === "floor" && floorId) {
        return await apiClient.updateFloorQuest(projectId, floorId, questId, {
          status,
        });
      }
    },
  );

  const { mutate: deleteQuest, loading: deleting } = useMutation(
    async (questId: string) => {
      if (type === "zone" && zoneId) {
        return await apiClient.deleteZoneQuest(projectId, zoneId, questId);
      } else if (type === "floor" && floorId) {
        return await apiClient.deleteFloorQuest(projectId, floorId, questId);
      }
      throw new Error("Invalid quest type or missing ID");
    },
  );

  const filteredQuests = quests.filter((quest) => {
    const matchesStatus =
      statusFilter === "all" || quest.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || quest.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (
    questId: string,
    newStatus: QuestStatus,
  ) => {
    const result = await updateQuestStatus({ questId, status: newStatus });
    if (result) {
      onQuestUpdated();
    }
  };

  const handleDeleteQuest = async (quest: Quest | FloorQuest) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la quête "${quest.title}" ?`,
      )
    ) {
      const result = await deleteQuest(quest.id);
      if (result) {
        onQuestUpdated();
      }
    }
  };

  const getStatusColor = (status: QuestStatus) => {
    const colors = {
      [QuestStatus.TODO]:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      [QuestStatus.IN_PROGRESS]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      [QuestStatus.TESTING]:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      [QuestStatus.DONE]:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      [QuestStatus.BLOCKED]:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status];
  };

  const getStatusIcon = (status: QuestStatus) => {
    const icons = {
      [QuestStatus.TODO]: "📋",
      [QuestStatus.IN_PROGRESS]: "🚀",
      [QuestStatus.TESTING]: "🧪",
      [QuestStatus.DONE]: "✅",
      [QuestStatus.BLOCKED]: "🚫",
    };
    return icons[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      [Priority.LOW]: "text-green-600",
      [Priority.MEDIUM]: "text-blue-600",
      [Priority.HIGH]: "text-orange-600",
      [Priority.CRITICAL]: "text-red-600",
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

  const questStats = {
    total: quests.length,
    todo: quests.filter((q) => q.status === QuestStatus.TODO).length,
    inProgress: quests.filter((q) => q.status === QuestStatus.IN_PROGRESS)
      .length,
    testing: quests.filter((q) => q.status === QuestStatus.TESTING).length,
    done: quests.filter((q) => q.status === QuestStatus.DONE).length,
    totalPomodoros: quests.reduce(
      (acc, q) => acc + (q.estimatedPomodoros || 0),
      0,
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ⚔️ Quêtes {type === "zone" ? "Zone" : "Floor"} (
            {filteredQuests.length}/{quests.length})
          </h3>

          {/* Stats rapides */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1">
              📋 <strong>{questStats.todo}</strong> À faire
            </span>
            <span className="flex items-center gap-1">
              🚀 <strong>{questStats.inProgress}</strong> En cours
            </span>
            <span className="flex items-center gap-1">
              🧪 <strong>{questStats.testing}</strong> Test
            </span>
            <span className="flex items-center gap-1">
              ✅ <strong>{questStats.done}</strong> Terminé
            </span>
            <span className="flex items-center gap-1">
              🍅 <strong>{questStats.totalPomodoros}</strong> Pomodoros
            </span>
          </div>
        </div>

        <button
          onClick={onCreateQuest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          ➕ Nouvelle Quête
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Tous les statuts</option>
          <option value={QuestStatus.TODO}>📋 À faire</option>
          <option value={QuestStatus.IN_PROGRESS}>🚀 En cours</option>
          <option value={QuestStatus.TESTING}>🧪 En test</option>
          <option value={QuestStatus.DONE}>✅ Terminé</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as typeof priorityFilter)
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Toutes les priorités</option>
          <option value={Priority.CRITICAL}>🔴 Critique</option>
          <option value={Priority.HIGH}>🟠 Haute</option>
          <option value={Priority.MEDIUM}>🔵 Moyenne</option>
          <option value={Priority.LOW}>🟢 Basse</option>
        </select>
      </div>

      {/* Liste des quêtes */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">⚔️</div>
          <p className="text-lg mb-2">Aucune quête trouvée</p>
          <p className="text-sm">
            {quests.length === 0
              ? "Créez votre première quête pour commencer !"
              : "Ajustez les filtres pour voir plus de quêtes."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuests
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((quest) => (
              <div
                key={quest.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden"
              >
                {/* Quest Header */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Titre et priorité */}
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quest.title}
                        </h4>
                        <span
                          className={`text-sm ${getPriorityColor(
                            quest.priority,
                          )}`}
                        >
                          {getPriorityIcon(quest.priority)} {quest.priority}
                        </span>
                        {quest.estimatedPomodoros &&
                          quest.estimatedPomodoros > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              🍅 {quest.estimatedPomodoros}
                            </span>
                          )}
                      </div>

                      {/* User Story */}
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {quest.userStory}
                      </p>

                      {/* Statut et actions */}
                      <div className="flex items-center gap-3">
                        <select
                          value={quest.status}
                          onChange={(e) =>
                            handleStatusChange(
                              quest.id,
                              e.target.value as QuestStatus,
                            )
                          }
                          disabled={updatingStatus}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 ${getStatusColor(
                            quest.status,
                          )}`}
                        >
                          <option value={QuestStatus.TODO}>
                            {getStatusIcon(QuestStatus.TODO)} À faire
                          </option>
                          <option value={QuestStatus.IN_PROGRESS}>
                            {getStatusIcon(QuestStatus.IN_PROGRESS)} En cours
                          </option>
                          <option value={QuestStatus.TESTING}>
                            {getStatusIcon(QuestStatus.TESTING)} En test
                          </option>
                          <option value={QuestStatus.DONE}>
                            {getStatusIcon(QuestStatus.DONE)} Terminé
                          </option>
                        </select>

                        <button
                          onClick={() =>
                            setExpandedQuest(
                              expandedQuest === quest.id ? null : quest.id,
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedQuest === quest.id
                            ? "▼ Réduire"
                            : "▶ Détails"}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleDeleteQuest(quest)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-800 text-sm p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Supprimer la quête"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quest Details (expandable) */}
                {expandedQuest === quest.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="space-y-4">
                      {/* Acceptance Criteria */}
                      {quest.acceptanceCriteria && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            ✅ Critères d&apos;Acceptation
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {quest.acceptanceCriteria}
                          </div>
                        </div>
                      )}

                      {/* Definition of Done */}
                      {quest.definitionOfDone && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            🏁 Definition of Done
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {quest.definitionOfDone}
                          </div>
                        </div>
                      )}

                      {/* Manual Tests */}
                      {quest.manualTests && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            🧪 Tests Manuels
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {quest.manualTests}
                          </div>
                        </div>
                      )}

                      {/* Technical Debt */}
                      {quest.technicalDebt && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            ⚠️ Dette Technique
                          </h5>
                          <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                            {quest.technicalDebt}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
