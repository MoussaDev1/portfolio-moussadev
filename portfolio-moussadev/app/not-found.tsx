import Link from "next/link";
import { Home, FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4 space-y-6">
          <div className="text-8xl font-bold text-muted-foreground/30 mb-4">
            404
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Page non trouvée
          </h1>

          <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                <FolderOpen className="w-4 h-4 mr-2" />
                Voir mes projets
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
