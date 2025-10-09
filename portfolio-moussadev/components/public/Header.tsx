import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl hover:text-foreground/80 transition-colors"
          >
            MoussaDev
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/projects"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Projets
            </Link>
            <Link
              href="/tech-radar"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              🧭 Tech Radar
            </Link>
            <Link
              href="/admin"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              📊 Admin
            </Link>
            <Link
              href="#contact"
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button className="text-foreground/80 hover:text-foreground transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
