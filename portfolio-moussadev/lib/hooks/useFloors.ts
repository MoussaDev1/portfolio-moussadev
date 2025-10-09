import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Floor } from "@/types/api";

export function useFloors(projectId: string) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFloors = async () => {
    if (!projectId) {
      setFloors([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getFloors(projectId);
      setFloors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch floors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return { floors, loading, error, refetch: fetchFloors };
}

export function useFloor(projectId: string, floorId: string) {
  const [floor, setFloor] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFloor = async () => {
      if (!projectId || !floorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getFloorById(projectId, floorId);
        setFloor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch floor");
      } finally {
        setLoading(false);
      }
    };

    if (projectId && floorId) {
      fetchFloor();
    }
  }, [projectId, floorId]);

  return { floor, loading, error };
}
