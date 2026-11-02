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

// Route d'information générale
apiRouter.get("/status", (req, res) => {
  res.json({
    status: "online",
    platform: "Plateforme Pâtisserie & Confiserie Algérie",
    currency: "DZD",
    totalWilayas: 69,
    timestamp: new Date().toISOString()
  });
});

