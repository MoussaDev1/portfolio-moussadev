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
  CreateQuestDto,
} from "@/types/api";
import {
  Technology,
  CreateTechnologyDto,
  UpdateTechnologyDto,
  TechRadarStats,
} from "@/types/technology";

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
      }
    );
  }

  // ========== PROJECTS ==========

  async getProjects(featured?: boolean): Promise<Project[]> {
    const params =
      featured !== undefined ? { featured: featured.toString() } : {};
    const response: AxiosResponse<Project[]> = await this.client.get(
      "/projects",
      { params }
    );
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.get(
      `/projects/${id}`
    );
    return response.data;
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.get(
      `/projects/slug/${slug}`
    );
    return response.data;
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.post(
      "/projects",
      data
    );
    return response.data;
  }

  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    const response: AxiosResponse<Project> = await this.client.patch(
      `/projects/${id}`,
      data
    );
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async getProjectStats(id: string): Promise<ProjectStats> {
    const response: AxiosResponse<ProjectStats> = await this.client.get(
      `/projects/${id}/stats`
    );
    return response.data;
  }

  // ========== ZONES ==========

  async getProjectZones(projectId: string): Promise<Zone[]> {
    const response: AxiosResponse<Zone[]> = await this.client.get(
      `/projects/${projectId}/zones`
    );
    return response.data;
  }

  async createZone(projectId: string, data: CreateZoneDto): Promise<Zone> {
    const response: AxiosResponse<Zone> = await this.client.post(
      `/projects/${projectId}/zones`,
      data
    );
    return response.data;
  }

  async updateZone(
    zoneId: string,
    data: Partial<CreateZoneDto>
  ): Promise<Zone> {
    const response: AxiosResponse<Zone> = await this.client.patch(
      `/zones/${zoneId}`,
      data
    );
    return response.data;
  }

  async deleteZone(zoneId: string): Promise<void> {
    await this.client.delete(`/zones/${zoneId}`);
  }

  // ========== FLOORS ==========

  async getProjectFloors(projectId: string): Promise<Floor[]> {
    const response: AxiosResponse<Floor[]> = await this.client.get(
      `/projects/${projectId}/floors`
    );
    return response.data;
  }

  async createFloor(projectId: string, data: CreateFloorDto): Promise<Floor> {
    const response: AxiosResponse<Floor> = await this.client.post(
      `/projects/${projectId}/floors`,
      data
    );
    return response.data;
  }

  async updateFloor(
    floorId: string,
    data: Partial<CreateFloorDto>
  ): Promise<Floor> {
    const response: AxiosResponse<Floor> = await this.client.patch(
      `/floors/${floorId}`,
      data
    );
    return response.data;
  }

  async deleteFloor(floorId: string): Promise<void> {
    await this.client.delete(`/floors/${floorId}`);
  }

  // ========== QUESTS ==========

  async getZoneQuests(zoneId: string): Promise<Quest[]> {
    const response: AxiosResponse<Quest[]> = await this.client.get(
      `/zones/${zoneId}/quests`
    );
    return response.data;
  }

  async createQuest(zoneId: string, data: CreateQuestDto): Promise<Quest> {
    const response: AxiosResponse<Quest> = await this.client.post(
      `/zones/${zoneId}/quests`,
      data
    );
    return response.data;
  }

  async updateQuest(
    questId: string,
    data: Partial<CreateQuestDto>
  ): Promise<Quest> {
    const response: AxiosResponse<Quest> = await this.client.patch(
      `/quests/${questId}`,
      data
    );
    return response.data;
  }

  async deleteQuest(questId: string): Promise<void> {
    await this.client.delete(`/quests/${questId}`);
  }

  // ========== FLOOR QUESTS ==========

  async getFloorQuests(floorId: string): Promise<FloorQuest[]> {
    const response: AxiosResponse<FloorQuest[]> = await this.client.get(
      `/floors/${floorId}/quests`
    );
    return response.data;
  }

  async createFloorQuest(
    floorId: string,
    data: CreateQuestDto
  ): Promise<FloorQuest> {
    const response: AxiosResponse<FloorQuest> = await this.client.post(
      `/floors/${floorId}/quests`,
      data
    );
    return response.data;
  }

  async updateFloorQuest(
    questId: string,
    data: Partial<CreateQuestDto>
  ): Promise<FloorQuest> {
    const response: AxiosResponse<FloorQuest> = await this.client.patch(
      `/floor-quests/${questId}`,
      data
    );
    return response.data;
  }

  async deleteFloorQuest(questId: string): Promise<void> {
    await this.client.delete(`/floor-quests/${questId}`);
  }

  // ========== HEALTH CHECK ==========

  async healthCheck(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.get(
      "/"
    );
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
      `/technologies${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  }

  async getTechnology(identifier: string): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.get(
      `/technologies/${identifier}`
    );
    return response.data;
  }

  async createTechnology(data: CreateTechnologyDto): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.post(
      "/technologies",
      data
    );
    return response.data;
  }

  async updateTechnology(
    id: string,
    data: UpdateTechnologyDto
  ): Promise<Technology> {
    const response: AxiosResponse<Technology> = await this.client.patch(
      `/technologies/${id}`,
      data
    );
    return response.data;
  }

  async deleteTechnology(id: string): Promise<void> {
    await this.client.delete(`/technologies/${id}`);
  }

  async getTechRadarStats(): Promise<TechRadarStats> {
    const response: AxiosResponse<TechRadarStats> = await this.client.get(
      "/technologies/stats"
    );
    return response.data;
  }
}

// Export d'une instance singleton
export const apiClient = new ApiClient();

// Export de la classe pour les tests ou instances multiples
export default ApiClient;
