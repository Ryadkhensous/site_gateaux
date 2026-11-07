import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dz_gateau_secret_key_2026_algeria_super_secure_jwt";
const JWT_EXPIRES_IN = "30d"; // Session de 30 jours pour une expérience client fluide

export interface TokenPayload {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  wilayaCode?: number;
}

/**
 * Hache un mot de passe avec un sel bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare un mot de passe en clair avec son hachage
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Génère un jeton JWT sécurisé
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Vérifie et décode un jeton JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
