import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Pause,
  Star,
} from "lucide-react";
import { Project } from "@/types/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

const statusConfig = {
  COMPLETED: {
    icon: CheckCircle2,
    label: "Terminé",
    variant: "default" as const,
  },
  ACTIVE: { icon: Clock, label: "En cours", variant: "secondary" as const },
  PLANNING: { icon: FileText, label: "Planifié", variant: "outline" as const },
  PAUSED: { icon: Pause, label: "Pausé", variant: "outline" as const },
};

export default function ProjectCard({
  project,
  priority = false,
}: ProjectCardProps) {
  const StatusIcon = statusConfig[project.status]?.icon || FileText;
  const statusLabel = statusConfig[project.status]?.label || project.status;
  const statusVariant = statusConfig[project.status]?.variant || "outline";

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
            <div className="text-muted-foreground/40 text-5xl font-bold">
              {project.title.charAt(0)}
            </div>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={statusVariant} className="gap-1">
            <StatusIcon className="w-3 h-3" />
            {statusLabel}
          </Badge>
        </div>

        {project.featured && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="default"
              className="gap-1 bg-yellow-500 hover:bg-yellow-600"
            >
              <Star className="w-3 h-3 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu */}
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
            {project.category && (
              <Badge variant="outline" className="text-xs shrink-0">
                {project.category}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge
                key={tech.technology.id}
                variant="secondary"
                className="text-xs"
              >
                {tech.technology.name}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer avec actions */}
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="group/btn">
          <Link href={`/projects/${project.slug}`}>
            Voir le projet
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>

        {(project.demoUrl || project.githubUrl) && (
          <div className="flex gap-2">
            {project.demoUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
              </Button>
            )}

            {project.githubUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
