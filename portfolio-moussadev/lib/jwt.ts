import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Convertir le secret en Uint8Array pour jose
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  admin: boolean;
  iat: number; // Issued at
  exp: number; // Expiration
}

/**
 * Génère un JWT signé pour l'authentification admin
 * @param expiresInDays Nombre de jours avant expiration (défaut: 7)
 * @returns Token JWT signé
 */
export async function signToken(expiresInDays: number = 7): Promise<string> {
  const iat = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
  const exp = iat + 60 * 60 * 24 * expiresInDays; // Expiration

  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

/**
 * Vérifie et décode un JWT
 * @param token Token JWT à vérifier
 * @returns Payload décodé si valide, null si invalide/expiré
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    // Vérifier que c'est un token admin
    if (payload.admin !== true) {
      return null;
    }

    return {
      admin: payload.admin as boolean,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    // Token invalide, expiré, ou signature incorrecte
    console.error("JWT verification failed:", error);
    return null;
  }
}
