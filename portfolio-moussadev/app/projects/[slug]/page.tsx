import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet non trouvé",
    };
  }

  return {
    title: `${project.title} - MoussaDev`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.images.thumbnail ? [project.images.thumbnail] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-foreground/60 mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link
              href="/projects"
              className="hover:text-foreground transition-colors"
            >
              Projets
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          {/* En-tête du projet */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === "completed"
                    ? "bg-green-500/10 text-green-700 dark:text-green-300"
                    : project.status === "in_progress"
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "bg-gray-500/10 text-gray-700 dark:text-gray-300"
                }`}
              >
                {project.status === "completed" && "✓ Terminé"}
                {project.status === "in_progress" && "⏳ En cours"}
                {project.status === "planned" && "📋 Planifié"}
              </span>

              <span className="text-sm text-foreground/60 bg-foreground/5 px-3 py-1 rounded-full">
                {project.category}
              </span>

              {project.featured && (
                <span className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Mis en avant
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-foreground/70 mb-8">
              {project.shortDescription}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Voir la démo
                </a>
              )}

              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-foreground/20 text-foreground hover:bg-foreground/5 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                  </svg>
                  Code source
                </a>
              )}
            </div>
          </div>

          {/* Image principale */}
          {project.images.thumbnail && (
            <div className="mb-12">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5 shadow-lg">
                <Image
                  src={project.images.thumbnail}
                  alt={project.title}
                  fill
                  className="object-contain object-center w-full h-full"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </div>
          )}

          {/* Informations du projet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  À propos du projet
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {project.fullDescription}
                </p>
              </section>

              {/* Points forts */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Points forts
                </h2>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start text-foreground/70"
                    >
                      <svg
                        className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Défis */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Défis techniques
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {project.challenges}
                </p>
              </section>

              {/* Apprentissages */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ce que j&apos;ai appris
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {project.learnings}
                </p>
              </section>

              {/* Galerie */}
              {project.images.gallery.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Galerie
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.images.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-foreground/5 hover:shadow-lg transition-shadow duration-300"
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="object-contain object-center hover:scale-105 transition-transform duration-300 w-full h-full"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              <div className="bg-foreground/5 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">
                  Technologies utilisées
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Détails */}
              <div className="bg-foreground/5 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Détails du projet</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Durée :</span>
                    <span className="font-medium">{project.duration}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground/60">Équipe :</span>
                    <span className="font-medium">
                      {project.team_size === 1
                        ? "Solo"
                        : `${project.team_size} personnes`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground/60">Début :</span>
                    <span className="font-medium">
                      {new Date(project.date_created).toLocaleDateString(
                        "fr-FR",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {project.date_completed && (
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Fin :</span>
                      <span className="font-medium">
                        {new Date(project.date_completed).toLocaleDateString(
                          "fr-FR",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-foreground/10">
            <Link
              href="/projects"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Retour aux projets
            </Link>

            <div className="text-center">
              <p className="text-foreground/60 text-sm mb-2">
                Vous aimez ce projet ?
              </p>
              <a
                href="#contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Discutons de votre idée
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
