import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur accède à une page admin
  const { pathname } = request.nextUrl;

  // Si c'est la page de login, laisser passer
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Pour toutes les autres routes /admin/*, vérifier l'authentification
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin-session");

    // Si pas de cookie, rediriger vers login
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérifier et décoder le JWT
    const payload = await verifyToken(sessionCookie.value);

    // Si le token est invalide, expiré, ou pas admin
    if (!payload || !payload.admin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    // Token valide : laisser passer
    // On pourrait ajouter le payload dans les headers pour y accéder dans les pages
    // const response = NextResponse.next();
    // response.headers.set('x-user-admin', 'true');
    // return response;
  }

  return NextResponse.next();
}

// Configuration : appliquer le middleware uniquement sur /admin/*
export const config = {
  matcher: "/admin/:path*",
};
