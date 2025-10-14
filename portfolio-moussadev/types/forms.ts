// Types spécifiques aux formulaires
import { ProjectType, ProjectStatus, QuestStatus, Priority } from "./api";

// Form types pour Projects
export interface ProjectFormData {
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  type: ProjectType;
  status: ProjectStatus;
  featured: boolean;
  category?: string;
  thumbnailUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  highlights?: string[];
  challenges?: string;
  learnings?: string;
  duration?: string;
  teamSize?: number;
}

// Form types pour Zones
export interface ZoneFormData {
  name: string;
  description?: string;
  order: number;
  projectId: string;
}

export interface CreateZoneDto {
  name: string;
  description?: string;
  order: number;
  projectId: string;
}

export interface UpdateZoneDto {
  name?: string;
  description?: string;
  order?: number;
}

// Form types pour Floors
export interface FloorFormData {
  name: string;
  description?: string;
  order: number;
  projectId: string;
}

export interface CreateFloorDto {
  name: string;
  description?: string;
  order: number;
  projectId: string;
}

export interface UpdateFloorDto {
  name?: string;
  description?: string;
  order?: number;
}

// Form types pour Zone Quests
export interface ZoneQuestFormData {
  title: string;
  userStory: string;
  definitionOfDone: string[];
  manualTests: string[];
  techDebt?: string;
  status: QuestStatus;
  priority: Priority;
  estimatedHours?: number;
  actualHours?: number;
  zoneId: string;
}

export interface CreateZoneQuestDto {
  title: string;
  userStory: string;
  definitionOfDone: string[];
  manualTests: string[];
  techDebt?: string;
  priority?: Priority;
  estimatedHours?: number;
}

export interface UpdateZoneQuestDto {
  title?: string;
  userStory?: string;
  definitionOfDone?: string[];
  manualTests?: string[];
  techDebt?: string;
  status?: QuestStatus;
  priority?: Priority;
  estimatedHours?: number;
  actualHours?: number;
}

// Form types pour Floor Quests
export interface FloorQuestFormData {
  title: string;
  userStory: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string;
  manualTests?: string;
  technicalDebt?: string;
  status: QuestStatus;
  priority: Priority;
  estimatedPomodoros?: number;
  order: number;
  floorId: string;
}

export interface CreateFloorQuestDto {
  title: string;
  userStory: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string[];
  manualTests?: string[];
  technicalDebt?: string;
  priority?: Priority;
  estimatedPomodoros?: number;
  order: number;
}

export interface UpdateFloorQuestDto {
  title?: string;
  userStory?: string;
  acceptanceCriteria?: string;
  definitionOfDone?: string[];
  manualTests?: string[];
  technicalDebt?: string;
  status?: QuestStatus;
  priority?: Priority;
  estimatedPomodoros?: number;
  actualPomodoros?: number;
  order?: number;
}

// Types pour les états de validation
export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
}
