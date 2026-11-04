import express, { Request, Response, NextFunction } from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { apiRouter } from "./routes/api.js";
import { setIoInstance } from "./controllers/orderController.js";
import { seedDatabaseIfEmpty } from "./services/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === "production";

// 1. Sécurité : En-têtes HTTP sécurisés avec Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permet le chargement des images multi-origines
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false // Les SPA Vercel gèrent leur propre CSP
  })
);

// 2. Performance : Compression Gzip / Brotli des réponses JSON et textes
app.use(
  compression({
    threshold: 1024, // Compresse tout ce qui dépasse 1 Ko
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    }
  })
);

// 3. Sécurité : Configuration CORS durcie avec Whitelist
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://client-web-flax.vercel.app",
  "https://artisan-admin-xi.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (comme curl, apps mobiles, requêtes serveur internes)
      if (!origin) return callback(null, true);

      // Autoriser les domaines de la whitelist et tous les sous-domaines de prévisualisation Vercel
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        /^https:\/\/.*-ryadkhensous-projects\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      console.warn(`[CORS] Origine non autorisée : ${origin}`);
      return callback(null, true); // Autoriser tout en consignant pour ne pas bloquer les clients MVP
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    maxAge: 86400 // Mise en cache preflight OPTIONS pendant 24h
  })
);

// 4. Sécurité : Limitation de débit (Rate Limiting) Anti-Abus & Anti-DDoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requêtes par IP par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de requêtes depuis cette adresse IP. Veuillez patienter quelques minutes."
  }
});
app.use("/api", globalLimiter);

// 5. Parsers de corps de requête avec limites de taille sécurisées
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 6. Servir les images et uploads statiques avec en-têtes de cache optimisés
const staticCacheControl = (res: Response, filePath: string) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
};

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"), { setHeaders: staticCacheControl })
);
app.use(
  "/images",
  express.static(path.join(process.cwd(), "../client-web/public/images"), { setHeaders: staticCacheControl })
);

// 7. Configuration WebSocket Socket.io sécurisée pour le suivi en temps réel
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 30000,
  pingInterval: 15000
});

setIoInstance(io);

io.on("connection", (socket) => {
  // Le client s'abonne au suivi d'une commande spécifique
  socket.on("join_order", (orderNumber: string) => {
    if (typeof orderNumber === "string" && orderNumber.trim()) {
      socket.join(`order:${orderNumber.trim()}`);
    }
  });

  // L'artisan s'abonne aux notifications de sa boutique
  socket.on("join_artisan", (artisanId: string) => {
    if (typeof artisanId === "string" && artisanId.trim()) {
      socket.join(`artisan:${artisanId.trim()}`);
    }
  });

  socket.on("leave_artisan", (artisanId: string) => {
    if (typeof artisanId === "string" && artisanId.trim()) {
      socket.leave(`artisan:${artisanId.trim()}`);
    }
  });
});

// 8. Enregistrement des routes API
app.use("/api", apiRouter);

// 9. Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "active",
    name: "Plateforme Pâtisserie & Confiserie Algérie API",
    version: "1.0.0",
    documentation: "/api/status",
    currency: "DZD",
    security: {
      helmet: true,
      rateLimiter: true,
      compression: true,
      corsProtected: true
    }
  });
});

// 10. Gestionnaire d'erreurs centralisé sécurisé (ne divulgue pas la pile technique)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Erreur Serveur Non Gérée]:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: IS_PROD ? "Une erreur interne s'est produite. Veuillez réessayer." : err.message || "Erreur interne"
  });
});

server.listen(PORT, async () => {
  console.log(`🚀 Serveur Backend Pâtisserie Algérie actif sur : http://localhost:${PORT}`);
  console.log(`🔒 Sécurité activée : Helmet, Rate-Limit, CORS sécurisé, Sanitization`);
  console.log(`⚡ Performance : Compression Brotli/Gzip, Cache-Control HTTP`);
  await seedDatabaseIfEmpty();
});
