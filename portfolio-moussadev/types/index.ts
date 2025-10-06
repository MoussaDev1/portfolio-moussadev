export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  category: string;
  status: "completed" | "in_progress" | "planned";
  featured: boolean;
  images: {
    thumbnail: string;
    gallery: string[];
  };
  links: {
    demo?: string | null;
    github?: string | null;
    case_study?: string | null;
  };
  highlights: string[];
  challenges: string;
  learnings: string;
  duration: string;
  team_size: number;
  date_completed: string | null;
  date_created: string;
}

export interface ProjectsData {
  projects: Project[];
  categories: string[];
  technologies: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}
