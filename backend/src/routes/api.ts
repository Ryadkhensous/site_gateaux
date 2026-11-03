import { Router } from "express";
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

export const apiRouter = Router();

// Routes Wilayas & Catalogue
apiRouter.get("/wilayas", getWilayas);
apiRouter.get("/artisans", getArtisans);
apiRouter.get("/artisans/:id", getArtisanById);
apiRouter.put("/artisans/:id", updateArtisanProfile);

apiRouter.get("/products", getProducts);
apiRouter.post("/products", createProduct);
apiRouter.post("/upload", uploadImage);

apiRouter.get("/customization-options", getCustomizationOptions);

// Routes Commandes & Réservations
apiRouter.post("/orders", createOrder);
apiRouter.get("/orders", getOrders);
apiRouter.get("/orders/:idOrNumber", getOrderByNumberOrId);
apiRouter.patch("/orders/:orderId/step", updateOrderStatusAndStep);

import { prisma, getDbStatus } from "../services/db.js";

// Route d'information générale & santé de la base de données
apiRouter.get("/status", async (req, res) => {
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
    database: dbDetails,
    timestamp: new Date().toISOString()
  });
});

