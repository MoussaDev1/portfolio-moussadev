import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Users,
  Clock,
} from "lucide-react";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GalleryCarousel from "@/components/public/GalleryCarousel";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet non trouvé",
      description: "Le projet que vous recherchez n'existe pas.",
    };
  }

  const technologies = project.technologies
    ?.map((t) => t.technology.name)
    .join(", ");

  const projectTypeLabel =
    project.type === "ZONE_SYSTEM" ? "Zone System" : "Floor System";

  return {
    title: project.title,
    description:
      project.description ||
      `Découvrez ${project.title}, un projet ${projectTypeLabel} développé par MoussaDev.`,
    keywords: [
      project.title,
      ...(project.technologies?.map((t) => t.technology.name) || []),
      projectTypeLabel.toLowerCase(),
      "projet",
      "portfolio",
      "développement web",
    ],
    openGraph: {
      title: `${project.title} | MoussaDev`,
      description:
        project.description ||
        `Découvrez ${project.title}, un projet développé avec ${
          technologies || "des technologies modernes"
        }`,
      type: "article",
      publishedTime: project.createdAt,
      modifiedTime: project.updatedAt,
      authors: ["MoussaDev"],
      images: project.thumbnailUrl
        ? [
            {
              url: project.thumbnailUrl,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | MoussaDev`,
      description:
        project.description || `Découvrez ce projet développé par MoussaDev`,
      images: project.thumbnailUrl ? [project.thumbnailUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              MoussaDev
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/projects"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Projets
              </Link>
              <Link
                href="/tech-radar"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Tech Radar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {project.thumbnailUrl && (
        <div className="relative h-[400px] w-full bg-gradient-to-b from-gray-900 to-background">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {project.status && (
              <Badge variant="secondary" className="px-3 py-1">
                {project.status}
              </Badge>
            )}
            {project.duration && (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {project.duration}
              </span>
            )}
            {project.teamSize && (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {project.teamSize}{" "}
                {project.teamSize > 1 ? "personnes" : "personne"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {project.githubUrl && (
            <Button asChild size="lg" variant="outline">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 mr-2" />
                Voir le code
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild size="lg">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Voir la démo
              </a>
            </Button>
          )}
        </div>

        {project.fullDescription && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">About</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {project.fullDescription}
            </p>
          </div>
        )}

        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Galerie</h2>
            <GalleryCarousel images={project.galleryImages} />
          </div>
        )}

        {project.highlights && project.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Points Forts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.highlights.map((h, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{h}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Technologies Utilisées</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech.technology.id}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  {tech.technology.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Défis Rencontrés</h2>
            <div className="space-y-3">
              {project.challenges.map((c, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{c}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {project.learnings && project.learnings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Apprentissages Clés</h2>
            <div className="space-y-3">
              {project.learnings.map((l, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{l}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 mt-12 border-t border-border">
          <Button asChild variant="ghost">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
