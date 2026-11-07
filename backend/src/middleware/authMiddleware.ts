import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/auth.js";

// Extension de l'interface Request pour inclure l'utilisateur connecté
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware obligatoire : bloque l'accès si non authentifié
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise. Veuillez vous connecter."
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({
      success: false,
      message: "Session expirée ou jeton invalide. Veuillez vous reconnecter."
    });
  }

  req.user = payload;
  next();
};

/**
 * Middleware optionnel : attache l'utilisateur s'il est connecté sans bloquer les invités
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
};
