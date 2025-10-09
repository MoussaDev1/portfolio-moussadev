import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Zone } from "@/types/api";

export function useZones(projectId: string) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = async () => {
    if (!projectId) {
      setZones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getZones(projectId);
      setZones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return { zones, loading, error, refetch: fetchZones };
}

export function useZone(projectId: string, zoneId: string) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZone = async () => {
      if (!projectId || !zoneId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getZoneById(projectId, zoneId);
        setZone(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch zone");
      } finally {
        setLoading(false);
      }
    };

    if (projectId && zoneId) {
      fetchZone();
    }
  }, [projectId, zoneId]);

  return { zone, loading, error };
}
