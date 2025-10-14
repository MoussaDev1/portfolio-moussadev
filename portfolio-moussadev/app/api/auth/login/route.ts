import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Vérifier le mot de passe avec la variable d'environnement
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("⚠️ ADMIN_PASSWORD n'est pas défini dans .env");
      return NextResponse.json(
        { error: "Configuration serveur incorrecte" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer un JWT signé cryptographiquement
    const token = await signToken(7); // Expire dans 7 jours

    // Créer un cookie sécurisé avec le JWT
    const cookieStore = await cookies();
    cookieStore.set("admin-session", token, {
      httpOnly: true, // Inaccessible au JavaScript côté client (protection XSS)
      secure: process.env.NODE_ENV === "production", // HTTPS uniquement en production
      sameSite: "lax", // Protection CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
