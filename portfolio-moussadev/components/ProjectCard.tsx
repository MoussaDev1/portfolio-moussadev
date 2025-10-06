import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/api";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({
  project,
  priority = false,
}: ProjectCardProps) {
  return (
    <div className="group bg-background border border-foreground/10 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-foreground/5 overflow-hidden">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-contain object-center group-hover:scale-105 transition-transform duration-300 w-full h-full"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <div className="text-foreground/40 text-4xl">
              {project.title.charAt(0)}
            </div>
          </div>
        )}

        {/* Badge statut */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === "COMPLETED"
                ? "bg-green-500/10 text-green-700 dark:text-green-300"
                : project.status === "ACTIVE"
                ? "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                : "bg-gray-500/10 text-gray-700 dark:text-gray-300"
            }`}
          >
            {project.status === "COMPLETED" && "✓ Terminé"}
            {project.status === "ACTIVE" && "⏳ En cours"}
            {project.status === "PLANNING" && "📋 Planifié"}
            {project.status === "PAUSED" && "⏸️ Pausé"}
          </span>
        </div>

        {/* Badge featured */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Mis en avant
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-foreground/60 bg-foreground/5 px-2 py-1 rounded">
            {project.category}
          </span>
        </div>

        <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 3).map((tech) => (
            <span
              key={tech.technology.id}
              className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
            >
              {tech.technology.name}
            </span>
          ))}
          {project.technologies && project.technologies.length > 3 && (
            <span className="text-xs text-foreground/60">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
          >
            Voir le projet →
          </Link>

          <div className="flex space-x-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Voir la démo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Voir le code source"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
