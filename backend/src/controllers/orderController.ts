import { Request, Response } from "express";
import { store, OrderItem, DEFAULT_TRACKING_STEPS } from "../services/store.js";
import { prisma, getDbStatus } from "../services/db.js";
import { Server } from "socket.io";

export let ioInstance: Server | null = null;
export const setIoInstance = (io: Server) => {
  ioInstance = io;
};

export const createOrder = async (req: Request, res: Response) => {
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

    // 1. Enregistrement persistant dans PostgreSQL via Prisma si disponible
    try {
      if (getDbStatus()) {
        await prisma.order.create({
          data: {
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            artisanId: newOrder.artisanId,
            productId: newOrder.productId || null,
            customerName: newOrder.customerName,
            customerPhone: newOrder.customerPhone,
            customerIdDocType: (newOrder.customerIdDocType as any) || "CNI",
            customerIdDocNumber: newOrder.customerIdDocNumber,
            deliveryWilayaCode: newOrder.deliveryWilayaCode,
            deliveryWilayaName: newOrder.deliveryWilayaName,
            deliveryAddress: newOrder.deliveryAddress,
            eventDate: new Date(newOrder.eventDate),
            isB2B: newOrder.isB2B,
            companyName: newOrder.companyName,
            companyNIF: newOrder.companyNIF,
            status: (newOrder.status as any) || "CONFIRMED",
            paymentMethod: newOrder.paymentMethod === "BARIDIMOB" ? "CASH_ON_DELIVERY" : (newOrder.paymentMethod as any) || "CASH_ON_DELIVERY",
            totalPriceDZD: newOrder.totalPriceDZD,
            notes: newOrder.notes,
            customization: newOrder.customization ? {
              create: {
                sizeName: newOrder.customization.sizeName,
                servingsCount: newOrder.customization.servingsCount,
                flavorName: newOrder.customization.flavorName,
                fillingName: newOrder.customization.fillingName,
                colorHex: newOrder.customization.colorHex,
                colorName: newOrder.customization.colorName,
                toppingsList: newOrder.customization.toppingsList || [],
                extra3dType: newOrder.customization.extra3dType,
                messageOnCake: newOrder.customization.messageOnCake
              }
            } : undefined,
            trackingSteps: {
              create: newOrder.trackingSteps.map((s, idx) => ({
                stepOrder: s.stepId || idx + 1,
                title: s.title,
                description: s.description,
                status: (s.status as any) || "CONFIRMED",
                completed: s.completed,
                completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
                photoProofUrl: s.photoProofUrl
              }))
            }
          }
        });
        console.log(`[PostgreSQL] Commande ${newOrder.orderNumber} enregistrée dans la BD avec succès.`);
      }
    } catch (dbErr) {
      console.warn("[PostgreSQL] Erreur sauvegarde DB (sauvegardé en mémoire):", dbErr);
    }

    // 2. Synchronisation mémoire vive
    store.orders.unshift(newOrder);

    // 3. Émission temps réel Socket.io
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

export const getOrders = async (req: Request, res: Response) => {
  const { artisanId, status, isB2B } = req.query;

  // Tentative de lecture depuis PostgreSQL
  try {
    if (getDbStatus()) {
      const dbOrders = await prisma.order.findMany({
        where: {
          artisanId: artisanId ? (artisanId as string) : undefined,
          status: status ? (status as any) : undefined,
          isB2B: isB2B !== undefined ? isB2B === "true" : undefined
        },
        include: {
          customization: true,
          trackingSteps: {
            orderBy: { stepOrder: "asc" }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      if (dbOrders && dbOrders.length > 0) {
        // Formatter pour le frontend
        const formatted = dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          artisanId: o.artisanId,
          artisanName: store.artisans.find((a) => a.id === o.artisanId)?.storeName || "Atelier Pâtisserie",
          productId: o.productId || undefined,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerIdDocType: o.customerIdDocType,
          customerIdDocNumber: o.customerIdDocNumber,
          deliveryWilayaCode: o.deliveryWilayaCode,
          deliveryWilayaName: o.deliveryWilayaName,
          deliveryAddress: o.deliveryAddress,
          eventDate: o.eventDate.toISOString(),
          isB2B: o.isB2B,
          companyName: o.companyName || undefined,
          companyNIF: o.companyNIF || undefined,
          status: o.status,
          paymentMethod: o.paymentMethod,
          totalPriceDZD: o.totalPriceDZD,
          notes: o.notes || undefined,
          createdAt: o.createdAt.toISOString(),
          customization: o.customization ? {
            sizeName: o.customization.sizeName || undefined,
            servingsCount: o.customization.servingsCount || undefined,
            flavorName: o.customization.flavorName || undefined,
            fillingName: o.customization.fillingName || undefined,
            colorHex: o.customization.colorHex || undefined,
            colorName: o.customization.colorName || undefined,
            toppingsList: o.customization.toppingsList,
            extra3dType: o.customization.extra3dType || undefined,
            messageOnCake: o.customization.messageOnCake || undefined
          } : undefined,
          trackingSteps: o.trackingSteps.map((s) => ({
            stepId: s.stepOrder,
            title: s.title,
            description: s.description,
            status: s.status,
            completed: s.completed,
            completedAt: s.completedAt ? s.completedAt.toISOString() : undefined,
            photoProofUrl: s.photoProofUrl || undefined
          }))
        }));

        return res.json({
          success: true,
          source: "postgresql",
          count: formatted.length,
          data: formatted
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur lecture orders, repli sur le store:", err);
  }

  // Repli sur le store en mémoire
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
    source: "memory",
    count: orders.length,
    data: orders
  });
};

export const getOrderByNumberOrId = async (req: Request, res: Response) => {
  const { idOrNumber } = req.params;

  // 1. Recherche dans PostgreSQL
  try {
    if (getDbStatus()) {
      const o = await prisma.order.findFirst({
        where: {
          OR: [
            { id: idOrNumber },
            { orderNumber: { equals: idOrNumber, mode: "insensitive" } }
          ]
        },
        include: {
          customization: true,
          trackingSteps: { orderBy: { stepOrder: "asc" } }
        }
      });

      if (o) {
        const formatted = {
          id: o.id,
          orderNumber: o.orderNumber,
          artisanId: o.artisanId,
          artisanName: store.artisans.find((a) => a.id === o.artisanId)?.storeName || "Atelier Pâtisserie",
          productId: o.productId || undefined,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerIdDocType: o.customerIdDocType,
          customerIdDocNumber: o.customerIdDocNumber,
          deliveryWilayaCode: o.deliveryWilayaCode,
          deliveryWilayaName: o.deliveryWilayaName,
          deliveryAddress: o.deliveryAddress,
          eventDate: o.eventDate.toISOString(),
          isB2B: o.isB2B,
          companyName: o.companyName || undefined,
          companyNIF: o.companyNIF || undefined,
          status: o.status,
          paymentMethod: o.paymentMethod,
          totalPriceDZD: o.totalPriceDZD,
          notes: o.notes || undefined,
          createdAt: o.createdAt.toISOString(),
          customization: o.customization ? {
            sizeName: o.customization.sizeName || undefined,
            servingsCount: o.customization.servingsCount || undefined,
            flavorName: o.customization.flavorName || undefined,
            fillingName: o.customization.fillingName || undefined,
            colorHex: o.customization.colorHex || undefined,
            colorName: o.customization.colorName || undefined,
            toppingsList: o.customization.toppingsList,
            extra3dType: o.customization.extra3dType || undefined,
            messageOnCake: o.customization.messageOnCake || undefined
          } : undefined,
          trackingSteps: o.trackingSteps.map((s) => ({
            stepId: s.stepOrder,
            title: s.title,
            description: s.description,
            status: s.status,
            completed: s.completed,
            completedAt: s.completedAt ? s.completedAt.toISOString() : undefined,
            photoProofUrl: s.photoProofUrl || undefined
          }))
        };

        return res.json({
          success: true,
          source: "postgresql",
          data: formatted
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur getOrder, repli sur mémoire:", err);
  }

  // 2. Recherche en mémoire
  const order = store.orders.find(
    (o) => o.id === idOrNumber || o.orderNumber.toUpperCase() === idOrNumber.toUpperCase()
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Commande introuvable" });
  }

  return res.json({
    success: true,
    source: "memory",
    data: order
  });
};

export const updateOrderStatusAndStep = async (req: Request, res: Response) => {
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
        order.trackingSteps[stepIdx].description += ` - Note: ${note}`;
      }
      for (let i = 0; i < stepIdx; i++) {
        order.trackingSteps[i].completed = true;
      }
    }
  }

  store.orders[orderIndex] = order;

  // Mise à jour PostgreSQL si actif
  try {
    if (getDbStatus()) {
      const dbOrder = await prisma.order.findFirst({
        where: { OR: [{ id: orderId }, { orderNumber: orderId }] }
      });
      if (dbOrder) {
        await prisma.order.update({
          where: { id: dbOrder.id },
          data: {
            status: status ? (status as any) : undefined
          }
        });

        if (stepId !== undefined) {
          await prisma.orderTrackingStep.updateMany({
            where: { orderId: dbOrder.id, stepOrder: Number(stepId) },
            data: {
              completed: true,
              completedAt: new Date(),
              photoProofUrl: photoProofUrl || undefined
            }
          });
        }
        console.log(`[PostgreSQL] Commande ${order.orderNumber} mise à jour dans la BD.`);
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur updateOrderStatusAndStep dans la BD:", err);
  }

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
