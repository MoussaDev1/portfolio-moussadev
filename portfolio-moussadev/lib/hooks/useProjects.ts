import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { Project } from "@/types/api";

export function useProjects(featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getProjects(featured);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [featured]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getProjects(featured);
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refetch projects",
      );
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, refetch };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  return { project, loading, error };
}
