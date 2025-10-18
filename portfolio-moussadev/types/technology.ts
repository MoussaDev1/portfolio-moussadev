export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: TechCategory;
  status: TechStatus;
  description?: string;
  iconUrl?: string;
  websiteUrl?: string;

  // Relations
  projects: {
    project: {
      id: string;
      slug: string;
      title: string;
      thumbnailUrl?: string;
      status: string;
    };
  }[];
  posts: {
    post: {
      id: string;
      slug: string;
      title: string;
      excerpt?: string;
      published: boolean;
      publishedAt?: string;
    };
  }[];

  createdAt: string;
  updatedAt: string;
}

export enum TechCategory {
  LANGUAGES = "LANGUAGES",
  FRAMEWORKS = "FRAMEWORKS",
  LIBRARIES = "LIBRARIES",
  TOOLS = "TOOLS",
  PLATFORMS = "PLATFORMS",
  DATABASES = "DATABASES",
  DEVOPS = "DEVOPS",
}

export enum TechStatus {
  MASTERED = "MASTERED",
  LEARNING = "LEARNING",
  TO_REVIEW = "TO_REVIEW",
  EXPLORING = "EXPLORING",
  DEPRECATED = "DEPRECATED",
}

export interface CreateTechnologyDto {
  name: string;
  slug: string;
  category: TechCategory;
  status: TechStatus;
  description?: string;
  iconUrl?: string;
  websiteUrl?: string;
}

export interface UpdateTechnologyDto {
  name?: string;
  slug?: string;
  category?: TechCategory;
  status?: TechStatus;
  description?: string;
  iconUrl?: string;
  websiteUrl?: string;
}

export interface TechRadarStats {
  total: number;
  byStatus: {
    mastered: number;
    learning: number;
    toReview: number;
    exploring: number;
    deprecated: number;
  };
  byCategory: Record<string, number>;
}
