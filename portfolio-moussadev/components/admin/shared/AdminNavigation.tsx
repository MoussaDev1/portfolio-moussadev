"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "🏠",
  },
  {
    name: "Projets",
    href: "/admin/projects",
    icon: "📁",
  },
  {
    name: "Zones",
    href: "/admin/zones",
    icon: "🏯",
  },
  {
    name: "Tech Radar",
    href: "/admin/tech-radar",
    icon: "🧭",
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/admin"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Admin Dashboard
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
