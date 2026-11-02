import { Request, Response } from "express";
import { store, OrderItem, DEFAULT_TRACKING_STEPS } from "../services/store.js";
import { Server } from "socket.io";

export let ioInstance: Server | null = null;
export const setIoInstance = (io: Server) => {
  ioInstance = io;
};

export const createOrder = (req: Request, res: Response) => {
  try {
    const {
      artisanId,
      productId,
      customerName,
      customerPhone,
      customerIdDocType,
      customerIdDocNumber,
      deliveryWilayaCode,
      deliveryAddress,
      eventDate,
      isB2B,
      companyName,
      companyNIF,
      paymentMethod,
      totalPriceDZD,
      notes,
      customization
    } = req.body;

    // Validation des données obligatoires
    if (!customerName || !customerPhone || !deliveryWilayaCode || !deliveryAddress || !eventDate) {
      return res.status(400).json({
        success: false,
        message: "Les champs obligatoires (Nom, Téléphone, Wilaya, Adresse, Date) doivent être remplis."
      });
    }

    const wilaya = store.wilayas.find((w) => w.code === Number(deliveryWilayaCode));
    const artisan = store.artisans.find((a) => a.id === artisanId) || store.artisans[0];

    const count = store.orders.length + 1;
    const orderNumber = `CMD-2026-DZ${count.toString().padStart(3, "0")}`;

    const newOrder: OrderItem = {
      id: `ord-dz-${Date.now()}`,
      orderNumber,
      artisanId: artisan.id,
      artisanName: artisan.storeName,
      productId,
      customerName,
      customerPhone,
      customerIdDocType: customerIdDocType || "CNI",
      customerIdDocNumber: customerIdDocNumber?.trim() || "DZ-CLIENT-WEB",
      deliveryWilayaCode: wilaya ? wilaya.code : Number(deliveryWilayaCode),
      deliveryWilayaName: wilaya ? wilaya.name : `Wilaya ${deliveryWilayaCode}`,
      deliveryAddress,
      eventDate,
      isB2B: Boolean(isB2B),
      companyName,
      companyNIF,
      status: "CONFIRMED",
      paymentMethod: paymentMethod || "CASH_ON_DELIVERY",
      totalPriceDZD: Number(totalPriceDZD) || 8500,
      notes,
      createdAt: new Date().toISOString(),
      customization,
      trackingSteps: DEFAULT_TRACKING_STEPS.map((step, idx) => ({
        ...step,
        completed: idx === 0,
        completedAt: idx === 0 ? new Date().toISOString() : undefined
      }))
    };

    store.orders.unshift(newOrder);

    // Émission temps réel si socket connecté
    if (ioInstance) {
      ioInstance.emit("new_order", newOrder);
      ioInstance.to(`artisan:${newOrder.artisanId}`).emit("artisan_new_order", newOrder);
    }

    return res.status(201).json({
      success: true,
      message: "Commande réservée avec succès",
      data: newOrder
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrders = (req: Request, res: Response) => {
  const { artisanId, status, isB2B } = req.query;
  let orders = store.orders;

  if (artisanId) {
    orders = orders.filter((o) => o.artisanId === artisanId);
  }

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  if (isB2B !== undefined) {
    orders = orders.filter((o) => o.isB2B === (isB2B === "true"));
  }

  return res.json({
    success: true,
    count: orders.length,
    data: orders
  });
};

export const getOrderByNumberOrId = (req: Request, res: Response) => {
  const { idOrNumber } = req.params;
  const order = store.orders.find(
    (o) => o.id === idOrNumber || o.orderNumber.toUpperCase() === idOrNumber.toUpperCase()
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Commande introuvable" });
  }

  return res.json({
    success: true,
    data: order
  });
};

export const updateOrderStatusAndStep = (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { stepId, status, photoProofUrl, note } = req.body;

  const orderIndex = store.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Commande introuvable" });
  }

  const order = store.orders[orderIndex];

  if (status) {
    order.status = status;
  }

  if (stepId !== undefined) {
    const stepIdx = order.trackingSteps.findIndex((s) => s.stepId === Number(stepId));
    if (stepIdx !== -1) {
      order.trackingSteps[stepIdx].completed = true;
      order.trackingSteps[stepIdx].completedAt = new Date().toISOString();
      if (photoProofUrl) {
        order.trackingSteps[stepIdx].photoProofUrl = photoProofUrl;
      }
      if (note) {
        order.trackingSteps[stepIdx].description += ` - Note artisan: ${note}`;
      }
      // Marquer aussi les étapes précédentes comme terminées
      for (let i = 0; i < stepIdx; i++) {
        order.trackingSteps[i].completed = true;
      }
    }
  }

  store.orders[orderIndex] = order;

  // Diffusion temps réel Socket.io
  if (ioInstance) {
    ioInstance.to(`order:${order.orderNumber}`).emit("order_updated", order);
    ioInstance.to(`order:${order.id}`).emit("order_updated", order);
    ioInstance.emit("order_status_changed", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      stepId
    });
  }

  return res.json({
    success: true,
    message: "Étape de fabrication mise à jour",
    data: order
  });
};

