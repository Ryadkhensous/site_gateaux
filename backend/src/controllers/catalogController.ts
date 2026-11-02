import { Request, Response } from "express";
import { store } from "../services/store.js";
import fs from "fs";
import path from "path";

export const getWilayas = (req: Request, res: Response) => {
  return res.json({
    success: true,
    total: store.wilayas.length,
    data: store.wilayas
  });
};

export const getArtisans = (req: Request, res: Response) => {
  const { wilaya } = req.query;
  let artisans = store.artisans;

  if (wilaya) {
    const wilayaCode = parseInt(wilaya as string, 10);
    artisans = artisans.filter((a) => a.wilayaCode === wilayaCode);
  }

  return res.json({
    success: true,
    count: artisans.length,
    data: artisans
  });
};

export const getArtisanById = (req: Request, res: Response) => {
  const { id } = req.params;
  const artisan = store.artisans.find((a) => a.id === id);

  if (!artisan) {
    return res.status(404).json({ success: false, message: "Artisan non trouvé" });
  }

  const artisanProducts = store.products.filter((p) => p.artisanId === id);

  return res.json({
    success: true,
    data: {
      ...artisan,
      products: artisanProducts
    }
  });
};

export const updateArtisanProfile = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = store.artisans.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Artisan non trouvé" });
  }

  store.artisans[index] = {
    ...store.artisans[index],
    ...req.body
  };

  return res.json({
    success: true,
    message: "Profil artisan mis à jour avec succès",
    data: store.artisans[index]
  });
};

export const getProducts = (req: Request, res: Response) => {
  const { category, customizable, artisanId } = req.query;
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
    count: products.length,
    data: products
  });
};

export const createProduct = (req: Request, res: Response) => {
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
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    isCustomizable: Boolean(isCustomizable),
    tags: tags || []
  };

  store.products.unshift(newProduct);

  return res.status(201).json({
    success: true,
    message: "Produit ajouté au catalogue avec succès",
    data: newProduct
  });
};

export const getCustomizationOptions = (req: Request, res: Response) => {
  return res.json({
    success: true,
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

