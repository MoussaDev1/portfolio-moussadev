import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MoussaDev - Développeur Full-Stack",
  description:
    "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js et TypeScript. Découvrez mes projets et réalisations.",
  keywords: [
    "développeur",
    "full-stack",
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "portfolio",
  ],
  authors: [{ name: "MoussaDev" }],
  openGraph: {
    title: "MoussaDev - Développeur Full-Stack",
    description:
      "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js et TypeScript.",
    type: "website",
    url: "https://moussadev.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoussaDev - Développeur Full-Stack",
    description:
      "Portfolio de MoussaDev - Développeur Full-Stack spécialisé en React, Next.js et TypeScript.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
