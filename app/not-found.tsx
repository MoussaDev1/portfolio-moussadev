import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl font-bold text-foreground/20 mb-4">404</div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            Page non trouvée
          </h1>

          <p className="text-foreground/70 mb-8">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retour à l&apos;accueil
            </Link>

            <Link
              href="/projects"
              className="block border border-foreground/20 text-foreground hover:bg-foreground/5 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Voir mes projets
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
