// Types synchronisés avec le backend NestJS + Prisma
export enum ProjectType {
  ZONE_SYSTEM = "ZONE_SYSTEM",
  FLOOR_SYSTEM = "FLOOR_SYSTEM",
}

export enum ProjectStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
}

export enum QuestStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  TESTING = "TESTING",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  order: number;
  projectId: string;
  quests: Quest[];
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  name: string;
  description?: string;
  order: number;
  projectId: string;
  floorQuests: FloorQuest[];
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  userStory: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string;
  manualTests?: string;
  technicalDebt?: string;
  status: QuestStatus;
  priority: Priority;
  estimatedPomodoros?: number;
  actualPomodoros?: number;
  order: number;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface FloorQuest {
  id: string;
  title: string;
  userStory: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string;
  manualTests?: string;
  technicalDebt?: string;
  status: QuestStatus;
  priority: Priority;
  estimatedPomodoros?: number;
  actualPomodoros?: number;
  order: number;
  floorId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  type: ProjectType;
  status: ProjectStatus;
  featured: boolean;
  category?: string;

  // Images et liens
  thumbnailUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;

  // Métadonnées
  highlights?: string; // JSON stringified array
  challenges?: string;
  learnings?: string;
  duration?: string;
  teamSize?: number;

  // Relations (incluent les données liées)
  zones?: Zone[];
  floors?: Floor[];
  technologies?: {
    technology: Technology;
  }[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  dateCompleted?: string;
}

// DTOs pour les API calls
export interface CreateProjectDto {
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  featured?: boolean;
  category?: string;
  thumbnailUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  highlights?: string;
  challenges?: string;
  learnings?: string;
  duration?: string;
  teamSize?: number;
  technologyIds?: string[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface CreateZoneDto {
  name: string;
  description?: string;
  order: number;
}

export interface CreateFloorDto {
  name: string;
  description?: string;
  order: number;
}

export interface CreateQuestDto {
  title: string;
  userStory: string;
  definitionOfDone?: string;
  manualTests?: string;
  techDebt?: string;
  status?: QuestStatus;
  priority?: Priority;
  estimatedHours?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectStats {
  totalZones: number;
  totalFloors: number;
  totalQuests: number;
  completedQuests: number;
  progressPercentage: number;
  totalPomodoroTime: number;
}

// DTOs pour les opérations CRUD
export interface CreateProjectDto {
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  technologies?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface UpdateProjectDto {
  slug?: string;
  title?: string;
  description?: string;
  fullDescription?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  technologies?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface CreateZoneDto {
  name: string;
  description?: string;
  order: number;
}

export interface CreateFloorDto {
  name: string;
  description?: string;
  order: number;
}

export interface CreateQuestDto {
  title: string;
  userStory: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string;
  manualTests?: string;
  technicalDebt?: string;
  priority?: Priority;
  estimatedPomodoros?: number;
  order: number;
}

// Legacy types pour compatibilité (à supprimer plus tard)
export interface ProjectsData {
  projects: Project[];
}
