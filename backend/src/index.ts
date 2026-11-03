import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { apiRouter } from "./routes/api.js";
import { setIoInstance } from "./controllers/orderController.js";
import { seedDatabaseIfEmpty } from "./services/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Configuration CORS permissive pour développement local
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Servir les images et uploads statiques
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/images", express.static(path.join(process.cwd(), "../client-web/public/images")));

// Configuration WebSocket Socket.io pour suivi en temps réel
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setIoInstance(io);

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connecté : ${socket.id}`);

  // Le client s'abonne au suivi d'une commande spécifique
  socket.on("join_order", (orderNumber: string) => {
    socket.join(`order:${orderNumber}`);
    console.log(`[Socket.io] Client ${socket.id} suit la commande: ${orderNumber}`);
  });

  // L'artisan s'abonne aux notifications de sa boutique
  socket.on("join_artisan", (artisanId: string) => {
    socket.join(`artisan:${artisanId}`);
    console.log(`[Socket.io] Artisan ${artisanId} connecté au canal temps réel`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client déconnecté : ${socket.id}`);
  });
});

// Enregistrement des routes API
app.use("/api", apiRouter);

// Root test
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Pâtisserie & Confiserie Algérie",
    documentation: "/api/status",
    currency: "DZD",
    supportedWilayas: 69
  });
});

server.listen(PORT, async () => {
  console.log(`🚀 Serveur Backend Pâtisserie Algérie actif sur : http://localhost:${PORT}`);
  console.log(`📦 Couverture : 69 Wilayas | Monnaie : DZD (Dinars Algériens)`);
  console.log(`⚡ Temps réel Socket.io : Actif`);
  await seedDatabaseIfEmpty();
});

