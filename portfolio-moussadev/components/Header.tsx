"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Projets", href: "/projects" },
  { name: "Tech Radar", href: "/tech-radar" },
  { name: "Contact", href: "#contact", isAnchor: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      // Sur la homepage, scroll vers #contact
      e.preventDefault();
      const contactSection = document.getElementById("contact");
      contactSection?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    } else {
      // Sur les autres pages, aller à /#contact
      // Le href="#contact" va automatiquement devenir "/#contact"
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:opacity-80 transition-opacity"
            >
              MoussaDev
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navigation.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleContactClick}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    "text-muted-foreground",
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ),
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1">
            {navigation.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleContactClick}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent",
                    "text-muted-foreground",
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent",
                    pathname === item.href
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
