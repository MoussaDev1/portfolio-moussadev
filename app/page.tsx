import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
                Salut, je suis{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MoussaDev
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto">
                Développeur Full-Stack passionné par la création
                d&apos;applications web modernes, performantes et centrées sur
                l&apos;expérience utilisateur.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/projects"
                  className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Découvrir mes projets
                </Link>

                <a
                  href="#contact"
                  className="border border-foreground/20 text-foreground hover:bg-foreground/5 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Me contacter
                </a>
              </div>
            </div>
          </div>

          {/* Gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 bg-foreground/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Technologies & Compétences
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Je maîtrise un large éventail de technologies modernes pour
                créer des solutions complètes et robustes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Frontend */}
              <div className="bg-background rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Frontend</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Interfaces utilisateur modernes et réactives
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "TypeScript", "Tailwind CSS"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Backend */}
              <div className="bg-background rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Backend</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  APIs robustes et bases de données performantes
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "Python", "PostgreSQL", "MongoDB"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* DevOps */}
              <div className="bg-background rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">DevOps & Outils</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Déploiement et outils de développement
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Docker", "Vercel", "Git", "AWS"].map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Projets mis en avant
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Découvrez une sélection de mes projets les plus aboutis et
                représentatifs de mes compétences techniques.
              </p>
            </div>

            {featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    priority={index < 2}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">
                  Aucun projet mis en avant pour le moment.
                </p>
                <Link
                  href="/projects"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Voir tous les projets →
                </Link>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/projects"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Voir tous les projets
                <svg
                  className="ml-1 w-4 h-4"
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
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-foreground/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Travaillons ensemble
            </h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Vous avez un projet en tête ? Je serais ravi d&apos;en discuter
              avec vous et de voir comment nous pouvons créer quelque chose
              d&apos;extraordinaire ensemble.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:contact@moussadev.com"
                className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Me contacter par email
              </a>

              <a
                href="https://linkedin.com/in/moussadev"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-foreground/20 text-foreground hover:bg-foreground/5 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
