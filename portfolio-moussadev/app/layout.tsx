import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moussadev.com"),
  title: {
    default: "MoussaDev - Développeur Full-Stack | Portfolio & Tech Radar",
    template: "%s | MoussaDev",
  },
  description:
    "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js, TypeScript, NestJS et PostgreSQL. Découvrez mes projets, mon Tech Radar et mes compétences techniques.",
  keywords: [
    "développeur",
    "full-stack",
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "nestjs",
    "nodejs",
    "postgresql",
    "prisma",
    "tailwindcss",
    "portfolio",
    "tech radar",
    "developer",
    "frontend",
    "backend",
  ],
  authors: [{ name: "MoussaDev", url: "https://moussadev.com" }],
  creator: "MoussaDev",
  publisher: "MoussaDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MoussaDev - Développeur Full-Stack | Portfolio & Tech Radar",
    description:
      "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js, TypeScript et NestJS. Découvrez mes projets et mon parcours technique.",
    type: "website",
    locale: "fr_FR",
    url: "https://moussadev.com",
    siteName: "MoussaDev Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MoussaDev - Développeur Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoussaDev - Développeur Full-Stack | Portfolio & Tech Radar",
    description:
      "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js, TypeScript et NestJS.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here", // À remplacer avec le vrai code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
