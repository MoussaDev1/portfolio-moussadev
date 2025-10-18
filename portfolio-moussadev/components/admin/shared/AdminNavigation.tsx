"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Castle,
  Building2,
  Radar,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  {
    name: "Projets",
    href: "/admin/projects",
    icon: FolderKanban,
    color: "text-primary",
  },
  {
    name: "Zones",
    href: "/admin/zones",
    icon: Castle,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Floors",
    href: "/admin/floors",
    icon: Building2,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Tech Radar",
    href: "/admin/tech-radar",
    icon: Radar,
    color: "text-primary",
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Erreur logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo + Nav */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-xl font-bold"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && item.color)} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Return to site */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Site
              </Link>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden sm:flex text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "..." : "Déconnexion"}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && item.color)} />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t pt-2 mt-2 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="w-5 h-5" />
                Retour au site
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {isLoggingOut ? "..." : "Déconnexion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
