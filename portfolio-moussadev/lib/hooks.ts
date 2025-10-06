import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Project, ProjectStats } from "@/types/api";

// Hook pour récupérer tous les projets
export function useProjects(featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProjects(featured);
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [featured]);

  return { projects, loading, error, refetch: () => setLoading(true) };
}

// Hook pour récupérer un projet par slug
export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error };
}

// Hook pour récupérer les stats d'un projet
export function useProjectStats(projectId: string) {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProjectStats(projectId);
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project stats"
        );
        console.error("Error fetching project stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [projectId]);

  return { stats, loading, error };
}

// Hook générique pour les mutations (create, update, delete)
export function useMutation<T, R>(mutationFn: (data: T) => Promise<R>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Mutation failed";
      setError(errorMessage);
      console.error("Mutation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
