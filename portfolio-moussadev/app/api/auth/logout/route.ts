import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Supprimer le cookie de session
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du logout:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
