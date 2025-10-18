import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStats,
  Zone,
  Floor,
  Quest,
  FloorQuest,
  CreateZoneDto,
  CreateFloorDto,
} from "@/types/api";
import {
  Technology,
  CreateTechnologyDto,
  UpdateTechnologyDto,
  TechRadarStats,
} from "@/types/technology";
import {
  CreateZoneQuestDto,
  UpdateZoneQuestDto,
  CreateFloorQuestDto,
  UpdateFloorQuestDto,
} from "@/types/forms";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur pour les réponses d'erreur
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  // ========== PROJECTS ==========

  async getProjects(featured?: boolean): Promise<Project[]> {
    const params =
      featured !== undefined ? { featured: featured.toString() } : {};
    const response: AxiosResponse<Project[]> = await this.client.get(
      "/projects",
      { params },
    );
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.get(
      `/projects/${id}`,
    );
    return response.data;
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.get(
      `/projects/slug/${slug}`,
    );
    return response.data;
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.post(
      "/projects",
      data,
    );
    return response.data;
  }

  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.patch(
      `/projects/${id}`,
      data,
    );
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async getProjectStats(id: string): Promise<ProjectStats> {
    const response: AxiosResponse<ProjectStats> = await this.client.get(
      `/projects/${id}/stats`,
    );
    return response.data;
  }

  // ========== ZONES (NESTED UNDER PROJECTS) ==========

  async getZones(projectId: string): Promise<Zone[]> {
    const response: AxiosResponse<Zone[]> = await this.client.get(
      `/projects/${projectId}/zones`,
    );
    return response.data;
  }

  async getZoneById(projectId: string, zoneId: string): Promise<Zone> {
    const response: AxiosResponse<Zone> = await this.client.get(
      `/projects/${projectId}/zones/${zoneId}`,
    );
    return response.data;
  }

  async createZone(projectId: string, data: CreateZoneDto): Promise<Zone> {
    const response: AxiosResponse<Zone> = await this.client.post(
      `/projects/${projectId}/zones`,
      data,
    );
    return response.data;
  }

  async updateZone(
    projectId: string,
    zoneId: string,
    data: Partial<CreateZoneDto>,
  ): Promise<Zone> {
    const response: AxiosResponse<Zone> = await this.client.put(
      `/projects/${projectId}/zones/${zoneId}`,
      data,
    );
    return response.data;
  }

  async deleteZone(projectId: string, zoneId: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}/zones/${zoneId}`);
  }

  async getZoneStats(
    projectId: string,
    zoneId: string,
  ): Promise<{
    totalQuests: number;
    completedQuests: number;
    inProgressQuests: number;
    blockedQuests: number;
    completionPercentage: number;
  }> {
    const response = await this.client.get(
      `/projects/${projectId}/zones/${zoneId}/stats`,
    );
    return response.data;
  }

  // ========== FLOORS (NESTED UNDER PROJECTS) ==========

  async getFloors(projectId: string): Promise<Floor[]> {
    const response: AxiosResponse<Floor[]> = await this.client.get(
      `/projects/${projectId}/floors`,
    );
    return response.data;
  }

  async getFloorById(projectId: string, floorId: string): Promise<Floor> {
    const response: AxiosResponse<Floor> = await this.client.get(
      `/projects/${projectId}/floors/${floorId}`,
    );
    return response.data;
  }

  async createFloor(projectId: string, data: CreateFloorDto): Promise<Floor> {
    const response: AxiosResponse<Floor> = await this.client.post(
      `/projects/${projectId}/floors`,
      data,
    );
    return response.data;
  }

  async updateFloor(
    projectId: string,
    floorId: string,
    data: Partial<CreateFloorDto>,
  ): Promise<Floor> {
    const response: AxiosResponse<Floor> = await this.client.put(
      `/projects/${projectId}/floors/${floorId}`,
      data,
    );
    return response.data;
  }

  async deleteFloor(projectId: string, floorId: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}/floors/${floorId}`);
  }

  async getFloorStats(
    projectId: string,
    floorId: string,
  ): Promise<{
    totalQuests: number;
    completedQuests: number;
    inProgressQuests: number;
    blockedQuests: number;
    completionPercentage: number;
  }> {
    const response = await this.client.get(
      `/projects/${projectId}/floors/${floorId}/stats`,
    );
    return response.data;
  }

  // ========== ZONE QUESTS (NESTED) ==========

  async getZoneQuests(projectId: string, zoneId: string): Promise<Quest[]> {
    const response: AxiosResponse<Quest[]> = await this.client.get(
      `/projects/${projectId}/zones/${zoneId}/quests`,
    );
    return response.data;
  }

  async getZoneQuestById(
    projectId: string,
    zoneId: string,
    questId: string,
  ): Promise<Quest> {
    const response: AxiosResponse<Quest> = await this.client.get(
      `/projects/${projectId}/zones/${zoneId}/quests/${questId}`,
    );
    return response.data;
  }

  async createZoneQuest(
    projectId: string,
    zoneId: string,
    data: CreateZoneQuestDto,
  ): Promise<Quest> {
    const response: AxiosResponse<Quest> = await this.client.post(
      `/projects/${projectId}/zones/${zoneId}/quests`,
      data,
    );
    return response.data;
  }

  async updateZoneQuest(
    projectId: string,
    zoneId: string,
    questId: string,
    data: UpdateZoneQuestDto,
  ): Promise<Quest> {
    const response: AxiosResponse<Quest> = await this.client.put(
      `/projects/${projectId}/zones/${zoneId}/quests/${questId}`,
      data,
    );
    return response.data;
  }

  async deleteZoneQuest(
    projectId: string,
    zoneId: string,
    questId: string,
  ): Promise<void> {
    await this.client.delete(
      `/projects/${projectId}/zones/${zoneId}/quests/${questId}`,
    );
  }

  // ========== FLOOR QUESTS (NESTED) ==========

  async getFloorQuests(
    projectId: string,
    floorId: string,
  ): Promise<FloorQuest[]> {
    const response: AxiosResponse<FloorQuest[]> = await this.client.get(
      `/projects/${projectId}/floors/${floorId}/quests`,
    );
    return response.data;
  }

  async getFloorQuestById(
    projectId: string,
    floorId: string,
    questId: string,
  ): Promise<FloorQuest> {
    const response: AxiosResponse<FloorQuest> = await this.client.get(
      `/projects/${projectId}/floors/${floorId}/quests/${questId}`,
    );
    return response.data;
  }

  async createFloorQuest(
    projectId: string,
    floorId: string,
    data: CreateFloorQuestDto,
  ): Promise<FloorQuest> {
    const response: AxiosResponse<FloorQuest> = await this.client.post(
      `/projects/${projectId}/floors/${floorId}/quests`,
      data,
    );
    return response.data;
  }

  async updateFloorQuest(
    projectId: string,
    floorId: string,
    questId: string,
    data: UpdateFloorQuestDto,
  ): Promise<FloorQuest> {
    const response: AxiosResponse<FloorQuest> = await this.client.put(
      `/projects/${projectId}/floors/${floorId}/quests/${questId}`,
      data,
    );
    return response.data;
  }

  async deleteFloorQuest(
    projectId: string,
    floorId: string,
    questId: string,
  ): Promise<void> {
    await this.client.delete(
      `/projects/${projectId}/floors/${floorId}/quests/${questId}`,
    );
  }

  // ========== HEALTH CHECK ==========

  async healthCheck(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> =
      await this.client.get("/");
    return response.data;
  }

  // ========== TECHNOLOGIES ==========

  async getTechnologies(filters?: {
    category?: string;
    status?: string;
  }): Promise<Technology[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.status) params.append("status", filters.status);

    const response: AxiosResponse<Technology[]> = await this.client.get(
      `/technologies${params.toString() ? `?${params.toString()}` : ""}`,
    );
    return response.data;
  }

  async getTechnology(identifier: string): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.get(
      `/technologies/${identifier}`,
    );
    return response.data;
  }

  async createTechnology(data: CreateTechnologyDto): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.post(
      "/technologies",
      data,
    );
    return response.data;
  }

  async updateTechnology(
    id: string,
    data: UpdateTechnologyDto,
  ): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.patch(
      `/technologies/${id}`,
      data,
    );
    return response.data;
  }

  async deleteTechnology(id: string): Promise<void> {
    await this.client.delete(`/technologies/${id}`);
  }

  async getTechRadarStats(): Promise<TechRadarStats> {
    const response: AxiosResponse<TechRadarStats> = await this.client.get(
      "/technologies/stats",
    );
    return response.data;
  }
}

// Export d'une instance singleton
export const apiClient = new ApiClient();

// Export de la classe pour les tests ou instances multiples
export default ApiClient;
