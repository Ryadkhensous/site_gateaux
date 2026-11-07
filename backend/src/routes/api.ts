import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import {
  getWilayas,
  getArtisans,
  getArtisanById,
  updateArtisanProfile,
  getProducts,
  createProduct,
  getCustomizationOptions,
  uploadImage
} from "../controllers/catalogController.js";
import {
  createOrder,
  getOrders,
  getOrderByNumberOrId,
  updateOrderStatusAndStep
} from "../controllers/orderController.js";
import {
  register,
  login,
  getProfile,
  updateProfile
} from "../controllers/authController.js";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import { prisma, getDbStatus } from "../services/db.js";

export const apiRouter = Router();

// Middleware de mise en cache HTTP pour accélérer la lecture côté client
const cacheResponse = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`);
    }
    next();
  };
};

// Rate limiter spécifique pour l'authentification (Anti-Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 tentatives par IP
  message: {
    success: false,
    message: "Trop de tentatives de connexion/inscription. Veuillez réessayer dans 15 minutes."
  }
});

// Rate limiter spécifique pour la création de commandes (Anti-Spam)
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Nombre limite de réservations atteint temporairement. Veuillez patienter."
  }
});

// Rate limiter spécifique pour l'upload d'images
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: {
    success: false,
    message: "Limite d'envoi d'images atteinte. Veuillez patienter avant d'envoyer d'autres photos."
  }
});

// ==========================================
// Routes Authentification & Profil Client
// ==========================================
apiRouter.post("/auth/register", authLimiter, register);
apiRouter.post("/auth/login", authLimiter, login);
apiRouter.get("/auth/me", requireAuth, getProfile);
apiRouter.put("/auth/profile", requireAuth, updateProfile);

// ==========================================
// Routes Wilayas & Catalogue
// ==========================================
apiRouter.get("/wilayas", cacheResponse(3600), getWilayas);
apiRouter.get("/artisans", cacheResponse(120), getArtisans);
apiRouter.get("/artisans/:id", cacheResponse(120), getArtisanById);
apiRouter.put("/artisans/:id", updateArtisanProfile);

apiRouter.get("/products", cacheResponse(60), getProducts);
apiRouter.post("/products", createProduct);
apiRouter.post("/upload", uploadLimiter, uploadImage);

apiRouter.get("/customization-options", cacheResponse(300), getCustomizationOptions);

// ==========================================
// Routes Commandes & Réservations
// ==========================================
apiRouter.post("/orders", optionalAuth, createOrderLimiter, createOrder);
apiRouter.get("/orders", getOrders);
apiRouter.get("/orders/:idOrNumber", getOrderByNumberOrId);
apiRouter.patch("/orders/:orderId/step", updateOrderStatusAndStep);

// ==========================================
// Route Statut & Santé de la Plateforme
// ==========================================
apiRouter.get("/status", async (req: Request, res: Response) => {
  let dbDetails = {
    connected: getDbStatus(),
    provider: "PostgreSQL",
    ordersInDb: 0,
    productsInDb: 0,
    artisansInDb: 0
  };

  try {
    if (getDbStatus()) {
      const [ordersCount, productsCount, artisansCount] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.artisanProfile.count()
      ]);
      dbDetails.ordersInDb = ordersCount;
      dbDetails.productsInDb = productsCount;
      dbDetails.artisansInDb = artisansCount;
    }
  } catch (err: any) {
    dbDetails.connected = false;
  }

  res.json({
    status: "online",
    platform: "Plateforme Pâtisserie & Confiserie Algérie",
    currency: "DZD",
    totalWilayas: 69,
    security: "hardened",
    auth: {
      jwt: true,
      roles: ["CLIENT", "ARTISAN", "ADMIN"]
    },
    database: dbDetails,
    timestamp: new Date().toISOString()
  });
});
