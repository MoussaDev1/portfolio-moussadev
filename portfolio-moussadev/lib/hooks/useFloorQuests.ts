import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { FloorQuest } from "@/types/api";

interface UseFloorQuestsParams {
  projectId?: string;
  floorId?: string;
}

export function useFloorQuests({ projectId, floorId }: UseFloorQuestsParams) {
  const [floorQuests, setFloorQuests] = useState<FloorQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFloorQuests = useCallback(async () => {
    if (!projectId) {
      setFloorQuests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data: FloorQuest[];

      if (floorId) {
        // Récupérer les quêtes d'un floor spécifique
        data = await apiClient.getFloorQuests(projectId, floorId);
      } else {
        // Récupérer toutes les quêtes du projet (via tous les floors)
        const floors = await apiClient.getFloors(projectId);
        data = floors.flatMap((floor) => floor.floorQuests || []);
      }

      setFloorQuests(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      console.error("Erreur useFloorQuests:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, floorId]);

  useEffect(() => {
    fetchFloorQuests();
  }, [fetchFloorQuests]);

  return {
    floorQuests,
    loading,
    error,
    refetch: fetchFloorQuests,
  };
}

// Hook pour récupérer une quête spécifique
export function useFloorQuest(
  projectId: string,
  floorId: string,
  questId: string
) {
  const [floorQuest, setFloorQuest] = useState<FloorQuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFloorQuest = useCallback(async () => {
    if (!projectId || !floorId || !questId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getFloorQuestById(
        projectId,
        floorId,
        questId
      );
      setFloorQuest(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      console.error("Erreur useFloorQuest:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, floorId, questId]);

  useEffect(() => {
    fetchFloorQuest();
  }, [fetchFloorQuest]);

  return {
    floorQuest,
    loading,
    error,
    refetch: fetchFloorQuest,
  };
}
