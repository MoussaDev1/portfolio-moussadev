import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ProjectsData } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // Lire le fichier projects.json
    const jsonDirectory = path.join(process.cwd(), "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/projects.json",
      "utf8"
    );
    const data: ProjectsData = JSON.parse(fileContents);

    let filteredProjects = data.projects;

    // Filtrer par catégorie si spécifiée
    if (category) {
      filteredProjects = filteredProjects.filter(
        (project) => project.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par projets featured si spécifié
    if (featured === "true") {
      filteredProjects = filteredProjects.filter((project) => project.featured);
    }

    // Trier par date de création (plus récents en premier)
    filteredProjects.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );

    // Limiter le nombre de résultats si spécifié
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        filteredProjects = filteredProjects.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      projects: filteredProjects,
      total: filteredProjects.length,
      categories: data.categories,
      technologies: data.technologies,
    });
  } catch (error) {
    console.error("Erreur lors de la lecture des projets:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des projets" },
      { status: 500 }
    );
  }
}
