import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Cloud,
  Sparkles,
  Radar,
  Database,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/public/Footer";
import ProjectCard from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProjects } from "@/lib/projects";
import { generatePersonJsonLd, generateWebsiteJsonLd } from "@/lib/seo";

export default async function Home() {
  const allFeaturedProjects = await getFeaturedProjects();
  // Limiter à 3 projets sur la homepage
  const featuredProjects = allFeaturedProjects.slice(0, 3);

  const personJsonLd = generatePersonJsonLd();
  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Disponible pour de nouveaux projets</span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                Développeur{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Full-Stack
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Je crée des applications web modernes, performantes et centrées
                sur l&apos;expérience utilisateur avec les dernières
                technologies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" asChild>
                  <Link href="/projects">
                    Découvrir mes projets
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <a href="#contact">Me contacter</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Technologies & Compétences
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Je maîtrise un large éventail de technologies modernes pour
                créer des solutions complètes et robustes.
              </p>
              <div className="pt-4">
                <Button asChild variant="outline" size="lg">
                  <Link href="/tech-radar">
                    <Radar className="w-5 h-5 mr-2" />
                    Voir mon Tech Radar complet
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Frontend */}
              <Card className="border-2 hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Code2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Frontend</CardTitle>
                  <CardDescription>
                    Interfaces utilisateur modernes et réactives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "TypeScript", "Tailwind CSS"].map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Backend */}
              <Card className="border-2 hover:border-green-500/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Backend</CardTitle>
                  <CardDescription>
                    APIs robustes et bases de données performantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "NestJS", "PostgreSQL", "Prisma"].map(
                      (tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* DevOps */}
              <Card className="border-2 hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Cloud className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>DevOps & Outils</CardTitle>
                  <CardDescription>
                    Déploiement et outils de développement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "Vercel", "Git", "Railway"].map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Projets mis en avant
                </h2>
                <p className="text-lg text-muted-foreground">
                  Découvrez une sélection de mes projets les plus aboutis
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/projects">
                  Voir tous les projets
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {featuredProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      priority={index < 2}
                    />
                  ))}
                </div>
                <div className="text-center mt-12 sm:hidden">
                  <Button variant="outline" asChild>
                    <Link href="/projects">
                      Voir tous les projets
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Aucun projet mis en avant pour le moment.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/projects">
                      Voir tous les projets
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-muted/30 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Travaillons ensemble
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vous avez un projet en tête ? Je serais ravi d&apos;en discuter
                avec vous et de voir comment nous pouvons créer quelque chose
                d&apos;extraordinaire ensemble.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" asChild>
                  <a href="mailto:contact@moussadev.com">
                    Me contacter par email
                  </a>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://linkedin.com/in/moussadev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
