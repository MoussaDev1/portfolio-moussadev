import { Project } from "@/types/api";

export function generateProjectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "WebApplication",
    author: {
      "@type": "Person",
      name: "MoussaDev",
      url: "https://moussadev.com",
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    datePublished: project.dateCompleted || project.createdAt,
    ...(project.thumbnailUrl && { image: project.thumbnailUrl }),
    ...(project.demoUrl && { url: project.demoUrl }),
    ...(project.githubUrl && {
      codeRepository: project.githubUrl,
    }),
    ...(project.technologies && {
      programmingLanguage: project.technologies.map((t) => t.technology.name),
    }),
  };
}

export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "MoussaDev",
    jobTitle: "Développeur Full-Stack",
    url: "https://moussadev.com",
    sameAs: [
      // Ajoute ici tes liens sociaux
      // "https://github.com/moussadev",
      // "https://linkedin.com/in/moussadev",
      // "https://twitter.com/moussadev"
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "TailwindCSS",
      "Full-Stack Development",
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MoussaDev Portfolio",
    url: "https://moussadev.com",
    description:
      "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js, TypeScript et NestJS",
    author: {
      "@type": "Person",
      name: "MoussaDev",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://moussadev.com/projects?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}
