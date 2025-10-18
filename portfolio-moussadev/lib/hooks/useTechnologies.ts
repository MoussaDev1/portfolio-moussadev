import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api";
import {
  Technology,
  CreateTechnologyDto,
  UpdateTechnologyDto,
  TechRadarStats,
} from "@/types/technology";

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [stats, setStats] = useState<TechRadarStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les technologies (avec filtres optionnels)
  const fetchTechnologies = useCallback(
    async (filters?: { category?: string; status?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getTechnologies(filters);
        setTechnologies(data);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des technologies";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Récupérer les statistiques
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTechRadarStats();
      setStats(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer une technologie par ID ou slug
  const fetchTechnologyById = useCallback(async (identifier: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTechnology(identifier);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de la technologie";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle technologie
  const createTechnology = useCallback(
    async (dto: CreateTechnologyDto) => {
      setLoading(true);
      setError(null);
      try {
        const newTech = await apiClient.createTechnology(dto);
        setTechnologies((prev) => [...prev, newTech]);

        // Mettre à jour les stats
        if (stats) {
          setStats({
            ...stats,
            total: stats.total + 1,
            byStatus: {
              ...stats.byStatus,
              [dto.status.toLowerCase() as keyof typeof stats.byStatus]:
                (stats.byStatus[
                  dto.status.toLowerCase() as keyof typeof stats.byStatus
                ] || 0) + 1,
            },
            byCategory: {
              ...stats.byCategory,
              [dto.category]: (stats.byCategory[dto.category] || 0) + 1,
            },
          });
        }

        return newTech;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la technologie";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [stats],
  );

  // Mettre à jour une technologie
  const updateTechnology = useCallback(
    async (id: string, dto: UpdateTechnologyDto) => {
      setLoading(true);
      setError(null);
      try {
        const updatedTech = await apiClient.updateTechnology(id, dto);
        setTechnologies((prev) =>
          prev.map((tech) => (tech.id === id ? updatedTech : tech)),
        );
        return updatedTech;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la technologie";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Supprimer une technologie
  const deleteTechnology = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.deleteTechnology(id);
        const deletedTech = technologies.find((tech) => tech.id === id);

        setTechnologies((prev) => prev.filter((tech) => tech.id !== id));

        // Mettre à jour les stats
        if (stats && deletedTech) {
          setStats({
            ...stats,
            total: stats.total - 1,
            byStatus: {
              ...stats.byStatus,
              [deletedTech.status.toLowerCase() as keyof typeof stats.byStatus]:
                Math.max(
                  (stats.byStatus[
                    deletedTech.status.toLowerCase() as keyof typeof stats.byStatus
                  ] || 0) - 1,
                  0,
                ),
            },
            byCategory: {
              ...stats.byCategory,
              [deletedTech.category]: Math.max(
                (stats.byCategory[deletedTech.category] || 0) - 1,
                0,
              ),
            },
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de la technologie";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [technologies, stats],
  );

  return {
    technologies,
    stats,
    loading,
    error,
    fetchTechnologies,
    fetchStats,
    fetchTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
  };
}
