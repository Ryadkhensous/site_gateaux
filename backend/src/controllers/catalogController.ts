import { Request, Response } from "express";
import { store } from "../services/store.js";
import { prisma, getDbStatus } from "../services/db.js";
import fs from "fs";
import path from "path";

export const getWilayas = (req: Request, res: Response) => {
  return res.json({
    success: true,
    total: store.wilayas.length,
    data: store.wilayas
  });
};

export const getArtisans = async (req: Request, res: Response) => {
  const { wilaya } = req.query;

  // 1. Essai de lecture depuis PostgreSQL
  try {
    if (getDbStatus()) {
      const wilayaCode = wilaya ? parseInt(wilaya as string, 10) : undefined;
      const dbArtisans = await prisma.artisanProfile.findMany({
        where: { wilayaCode: wilayaCode || undefined },
        include: { products: true }
      });

      if (dbArtisans && dbArtisans.length > 0) {
        return res.json({
          success: true,
          source: "postgresql",
          count: dbArtisans.length,
          data: dbArtisans
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur lecture artisans, repli sur le store:", err);
  }

  // 2. Repli mémoire
  let artisans = store.artisans;
  if (wilaya) {
    const wilayaCode = parseInt(wilaya as string, 10);
    artisans = artisans.filter((a) => a.wilayaCode === wilayaCode);
  }

  return res.json({
    success: true,
    source: "memory",
    count: artisans.length,
    data: artisans
  });
};

export const getArtisanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // 1. Recherche dans PostgreSQL
  try {
    if (getDbStatus()) {
      const artisan = await prisma.artisanProfile.findUnique({
        where: { id },
        include: { products: true }
      });

      if (artisan) {
        return res.json({
          success: true,
          source: "postgresql",
          data: artisan
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur lecture artisan par ID, repli:", err);
  }

  // 2. Repli mémoire
  const artisan = store.artisans.find((a) => a.id === id);
  if (!artisan) {
    return res.status(404).json({ success: false, message: "Artisan non trouvé" });
  }

  const artisanProducts = store.products.filter((p) => p.artisanId === id);

  return res.json({
    success: true,
    source: "memory",
    data: {
      ...artisan,
      products: artisanProducts
    }
  });
};

export const updateArtisanProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Mise à jour PostgreSQL si actif
  try {
    if (getDbStatus()) {
      const updated = await prisma.artisanProfile.update({
        where: { id },
        data: {
          storeName: req.body.storeName,
          bio: req.body.bio,
          phone: req.body.phone,
          address: req.body.address
        }
      });
      console.log(`[PostgreSQL] Profil artisan ${id} mis à jour dans la BD.`);
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur update artisan:", err);
  }

  const index = store.artisans.findIndex((a) => a.id === id);
  if (index !== -1) {
    store.artisans[index] = {
      ...store.artisans[index],
      ...req.body
    };
  }

  return res.json({
    success: true,
    message: "Profil artisan mis à jour avec succès",
    data: index !== -1 ? store.artisans[index] : req.body
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const { category, customizable, artisanId } = req.query;

  // 1. Lecture PostgreSQL
  try {
    if (getDbStatus()) {
      const dbProducts = await prisma.product.findMany({
        where: {
          category: category ? (category as any) : undefined,
          isCustomizable: customizable !== undefined ? customizable === "true" : undefined,
          artisanId: artisanId ? (artisanId as string) : undefined
        }
      });

      if (dbProducts && dbProducts.length > 0) {
        return res.json({
          success: true,
          source: "postgresql",
          count: dbProducts.length,
          data: dbProducts
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur lecture produits:", err);
  }

  // 2. Repli mémoire
  let products = store.products;

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (customizable !== undefined) {
    const isCust = customizable === "true";
    products = products.filter((p) => p.isCustomizable === isCust);
  }

  if (artisanId) {
    products = products.filter((p) => p.artisanId === artisanId);
  }

  return res.json({
    success: true,
    source: "memory",
    count: products.length,
    data: products
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const { artisanId, name, category, description, priceDZD, servings, prepTimeDays, imageUrl, isCustomizable, tags } = req.body;

  if (!artisanId || !name || !priceDZD) {
    return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    artisanId,
    name,
    category: category || "MODERNE",
    description: description || "",
    priceDZD: Number(priceDZD),
    servings: Number(servings) || 12,
    prepTimeDays: Number(prepTimeDays) || 3,
    imageUrl: imageUrl || "/images/hero_wedding_cake.jpg",
    isCustomizable: Boolean(isCustomizable),
    tags: tags || []
  };

  // 1. Sauvegarde dans PostgreSQL si actif
  try {
    if (getDbStatus()) {
      await prisma.product.create({
        data: {
          id: newProduct.id,
          artisanId: newProduct.artisanId,
          name: newProduct.name,
          category: newProduct.category as any,
          description: newProduct.description,
          priceDZD: newProduct.priceDZD,
          servings: newProduct.servings,
          prepTimeDays: newProduct.prepTimeDays,
          imageUrl: newProduct.imageUrl,
          isCustomizable: newProduct.isCustomizable,
          tags: newProduct.tags
        }
      });
      console.log(`[PostgreSQL] Nouveau produit ${newProduct.name} inséré dans la BD.`);
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur createProduct dans la BD:", err);
  }

  store.products.unshift(newProduct);

  return res.status(201).json({
    success: true,
    message: "Produit ajouté au catalogue avec succès",
    data: newProduct
  });
};

export const getCustomizationOptions = async (req: Request, res: Response) => {
  // Lecture PostgreSQL
  try {
    if (getDbStatus()) {
      const options = await prisma.customizationOption.findMany();
      if (options && options.length > 0) {
        return res.json({
          success: true,
          source: "postgresql",
          data: options
        });
      }
    }
  } catch (err) {
    console.warn("[PostgreSQL] Erreur lecture options customisation:", err);
  }

  return res.json({
    success: true,
    source: "memory",
    data: store.customizationOptions
  });
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { imageBase64, fileName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: "Aucune image fournie" });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      if (imageBase64.startsWith("http") || imageBase64.startsWith("/")) {
        return res.json({ success: true, url: imageBase64 });
      }
      return res.status(400).json({ success: false, message: "Format d'image base64 invalide" });
    }

    const mime = matches[1];
    let ext = "jpg";
    if (mime.includes("png")) ext = "png";
    else if (mime.includes("webp")) ext = "webp";
    else if (mime.includes("gif")) ext = "gif";

    const buffer = Buffer.from(matches[2], "base64");
    const safeName = `cake_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    // Target upload directories
    const uploadDirs = [
      path.resolve(process.cwd(), "../client-web/public/uploads"),
      path.resolve(process.cwd(), "../artisan-admin/public/uploads"),
      path.resolve(process.cwd(), "public/uploads")
    ];

    for (const dir of uploadDirs) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, safeName), buffer);
      } catch (e) {
        console.warn(`[Upload] Impossible d'écrire dans ${dir}:`, e);
      }
    }

    return res.status(201).json({
      success: true,
      url: `/uploads/${safeName}`,
      fileName: safeName
    });
  } catch (error: any) {
    console.error("[Upload Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
