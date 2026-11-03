import { PrismaClient } from "@prisma/client";
import { INITIAL_ARTISANS, INITIAL_PRODUCTS, CUSTOMIZATION_OPTIONS } from "../data/initialData.js";
import { store, DEFAULT_TRACKING_STEPS } from "./store.js";

export const prisma = new PrismaClient();

let isDbConnected = false;

export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    return true;
  } catch (err) {
    isDbConnected = false;
    return false;
  }
};

export const getDbStatus = () => isDbConnected;

export const seedDatabaseIfEmpty = async () => {
  try {
    const connected = await checkDbConnection();
    if (!connected) {
      console.warn("[PostgreSQL] Base de données inaccessible au démarrage. Fonctionnement sur le store en mémoire.");
      return false;
    }

    console.log("[PostgreSQL] Connexion réussie à la base de données !");

    // 1. Initialiser ou synchroniser les artisans
    for (const artisan of INITIAL_ARTISANS) {
      const user = await prisma.user.upsert({
        where: { email: `artisan_${artisan.id}@elgateau.dz` },
        update: {
          fullName: artisan.name,
          phone: artisan.phone,
          wilayaCode: artisan.wilayaCode,
          wilayaName: artisan.wilayaName
        },
        create: {
          email: `artisan_${artisan.id}@elgateau.dz`,
          passwordHash: "hash_dz_2026",
          fullName: artisan.name,
          phone: artisan.phone,
          role: "ARTISAN",
          wilayaCode: artisan.wilayaCode,
          wilayaName: artisan.wilayaName
        }
      });

      await prisma.artisanProfile.upsert({
        where: { id: artisan.id },
        update: {
          storeName: artisan.storeName,
          bio: artisan.bio,
          phone: artisan.phone,
          address: artisan.address,
          avatar: artisan.avatar,
          banner: artisan.banner,
          specialties: artisan.specialties
        },
        create: {
          id: artisan.id,
          userId: user.id,
          storeName: artisan.storeName,
          wilayaCode: artisan.wilayaCode,
          wilayaName: artisan.wilayaName,
          address: artisan.address,
          phone: artisan.phone,
          rating: artisan.rating,
          reviewsCount: artisan.reviewsCount,
          bio: artisan.bio,
          avatar: artisan.avatar,
          banner: artisan.banner,
          specialties: artisan.specialties
        }
      });
    }

    // 2. Insérer ou mettre à jour tous les produits du catalogue
    for (const prod of INITIAL_PRODUCTS) {
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {
          name: prod.name,
          category: prod.category as any,
          description: prod.description,
          priceDZD: prod.priceDZD,
          servings: prod.servings,
          prepTimeDays: prod.prepTimeDays,
          imageUrl: prod.imageUrl,
          isCustomizable: prod.isCustomizable,
          tags: prod.tags
        },
        create: {
          id: prod.id,
          artisanId: prod.artisanId,
          name: prod.name,
          category: prod.category as any,
          description: prod.description,
          priceDZD: prod.priceDZD,
          servings: prod.servings,
          prepTimeDays: prod.prepTimeDays,
          imageUrl: prod.imageUrl,
          isCustomizable: prod.isCustomizable,
          tags: prod.tags
        }
      });
    }

    // 3. Insérer les options de personnalisation
    for (const opt of CUSTOMIZATION_OPTIONS) {
      await prisma.customizationOption.upsert({
        where: { id: opt.id },
        update: {
          name: opt.name,
          priceDZD: opt.priceDZD,
          description: opt.description,
          colorHex: opt.colorHex
        },
        create: {
          id: opt.id,
          category: opt.category,
          name: opt.name,
          priceDZD: opt.priceDZD,
          description: opt.description,
          colorHex: opt.colorHex
        }
      });
    }

      // 4. Insérer les commandes initiales de démo
      const demoOrder = store.orders[0];
      if (demoOrder) {
        await prisma.order.upsert({
          where: { orderNumber: demoOrder.orderNumber },
          update: {},
          create: {
            id: demoOrder.id,
            orderNumber: demoOrder.orderNumber,
            artisanId: demoOrder.artisanId,
            customerName: demoOrder.customerName,
            customerPhone: demoOrder.customerPhone,
            customerIdDocType: (demoOrder.customerIdDocType as any) || "CNI",
            customerIdDocNumber: demoOrder.customerIdDocNumber,
            deliveryWilayaCode: demoOrder.deliveryWilayaCode,
            deliveryWilayaName: demoOrder.deliveryWilayaName,
            deliveryAddress: demoOrder.deliveryAddress,
            eventDate: new Date(demoOrder.eventDate),
            isB2B: demoOrder.isB2B,
            status: (demoOrder.status as any) || "CONFIRMED",
            paymentMethod: demoOrder.paymentMethod === "BARIDIMOB" ? "CASH_ON_DELIVERY" : (demoOrder.paymentMethod as any) || "CASH_ON_DELIVERY",
            totalPriceDZD: demoOrder.totalPriceDZD,
            notes: demoOrder.notes,
            customization: demoOrder.customization ? {
              create: {
                sizeName: demoOrder.customization.sizeName,
                servingsCount: demoOrder.customization.servingsCount,
                flavorName: demoOrder.customization.flavorName,
                fillingName: demoOrder.customization.fillingName,
                colorHex: demoOrder.customization.colorHex,
                colorName: demoOrder.customization.colorName,
                toppingsList: demoOrder.customization.toppingsList || [],
                extra3dType: demoOrder.customization.extra3dType,
                messageOnCake: demoOrder.customization.messageOnCake
              }
            } : undefined,
            trackingSteps: {
              create: demoOrder.trackingSteps.map((s, idx) => ({
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
      }

      console.log("[PostgreSQL] Données initiales insérées avec succès dans la base de données !");

    return true;
  } catch (err) {
    console.error("[PostgreSQL] Erreur lors de l'initialisation des données:", err);
    return false;
  }
};

