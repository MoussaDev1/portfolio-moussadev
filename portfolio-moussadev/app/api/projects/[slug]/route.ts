import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ProjectsData } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Lire le fichier projects.json
    const jsonDirectory = path.join(process.cwd(), "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/projects.json",
      "utf8"
    );
    const data: ProjectsData = JSON.parse(fileContents);

    // Trouver le projet par slug
    const project = data.projects.find((p) => p.slug === slug);

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Erreur lors de la lecture du projet:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du projet" },
      { status: 500 }
    );
  }
}
