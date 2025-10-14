import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet non trouvé" };
  return {
    title: `${project.title} - MoussaDev`,
    description: project.description || "Découvrez ce projet",
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
                href="/#projects"
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
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            {project.status && (
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                {project.status}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-1">
                Duration: {project.duration}
              </span>
            )}
            {project.teamSize && (
              <span className="flex items-center gap-1">
                Team: {project.teamSize}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Demo
            </a>
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

        {project.highlights && project.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-colors"
                >
                  <p className="text-foreground/90">{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech.technology.id}
                  className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg font-medium hover:bg-blue-500/20 transition-colors"
                >
                  {tech.technology.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Challenges
            </h2>
            <div className="space-y-3">
              {project.challenges.map((c, i) => (
                <div
                  key={i}
                  className="p-4 bg-orange-500/5 border-l-4 border-orange-500 rounded-r-lg"
                >
                  <p className="text-foreground/90">{c}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.learnings && project.learnings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Learnings
            </h2>
            <div className="space-y-3">
              {project.learnings.map((l, i) => (
                <div
                  key={i}
                  className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded-r-lg"
                >
                  <p className="text-foreground/90">{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 mt-12 border-t border-border">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Back to projects
          </Link>
        </div>
      </main>
    </div>
  );
}
