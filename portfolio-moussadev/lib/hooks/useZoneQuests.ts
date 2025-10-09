import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { Quest } from "@/types/api";

export function useZoneQuests(projectId: string, zoneId: string) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    if (!projectId || !zoneId) {
      setQuests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getZoneQuests(projectId, zoneId);
      setQuests(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des quests"
      );
      console.error("Erreur useZoneQuests:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, zoneId]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const refetch = useCallback(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    loading,
    error,
    refetch,
  };
}

export function useProjectQuests(projectId: string) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    if (!projectId) {
      setQuests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Récupérer toutes les zones du projet puis toutes leurs quêtes
      const zones = await apiClient.getZones(projectId);
      const allQuests: Quest[] = [];

      // Récupérer les quêtes de chaque zone
      for (const zone of zones) {
        try {
          const zoneQuests = await apiClient.getZoneQuests(projectId, zone.id);
          allQuests.push(...zoneQuests);
        } catch (zoneError) {
          console.warn(
            `Erreur lors du chargement des quêtes de la zone ${zone.name}:`,
            zoneError
          );
        }
      }

      setQuests(allQuests);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des quests du projet"
      );
      console.error("Erreur useProjectQuests:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const refetch = useCallback(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    loading,
    error,
    refetch,
  };
}

export function useZoneQuestById(
  projectId: string,
  zoneId: string,
  questId: string
) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuest = useCallback(async () => {
    if (!projectId || !zoneId || !questId) {
      setQuest(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getZoneQuestById(projectId, zoneId, questId);
      setQuest(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de la quest"
      );
      console.error("Erreur useZoneQuestById:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, zoneId, questId]);

  useEffect(() => {
    fetchQuest();
  }, [fetchQuest]);

  const refetch = useCallback(() => {
    fetchQuest();
  }, [fetchQuest]);

  return {
    quest,
    loading,
    error,
    refetch,
  };
}
