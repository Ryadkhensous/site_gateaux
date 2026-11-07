import { Request, Response } from "express";
import { prisma, getDbStatus } from "../services/db.js";
import { store } from "../services/store.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { sanitizeString, ALGERIA_PHONE_REGEX } from "../utils/security.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

/**
 * Inscription d'un nouveau client (Sign Up)
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, wilayaCode, address } = req.body;

    // Assainissement des données
    const cleanName = sanitizeString(fullName);
    const cleanEmail = sanitizeString(email).toLowerCase();
    const cleanPhone = sanitizeString(phone).replace(/[\s\.-]/g, "");
    const cleanAddress = sanitizeString(address);

    // Validations
    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires (Nom, Email, Téléphone, Mot de passe) doivent être renseignés."
      });
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Format d'adresse email invalide."
      });
    }

    // Validation téléphone algérien (05/06/07 ou +213)
    if (!ALGERIA_PHONE_REGEX.test(cleanPhone) && cleanPhone.length < 9) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un numéro de téléphone algérien valide (ex: 0555123456)."
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères."
      });
    }

    const wilayaNum = Number(wilayaCode) || 16;
    const wilayaObj = store.wilayas.find((w) => w.code === wilayaNum);
    const wilayaName = wilayaObj ? wilayaObj.name : "Alger";

    // 1. Vérification si l'utilisateur existe déjà dans PostgreSQL
    if (getDbStatus()) {
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: cleanEmail }, { phone: cleanPhone }]
          }
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: existingUser.email === cleanEmail 
              ? "Cette adresse email est déjà enregistrée. Veuillez vous connecter." 
              : "Ce numéro de téléphone est déjà associé à un compte."
          });
        }
      } catch (err) {
        console.warn("[PostgreSQL] Erreur vérification compte existant:", err);
      }
    }

    // Hachage sécurisé du mot de passe
    const passwordHash = await hashPassword(password);
    const userId = `usr-dz-${Date.now()}`;

    let createdUser: any = {
      id: userId,
      email: cleanEmail,
      fullName: cleanName,
      phone: cleanPhone,
      role: "CLIENT",
      wilayaCode: wilayaNum,
      wilayaName,
      address: cleanAddress || undefined,
      createdAt: new Date().toISOString()
    };

    // Enregistrement dans PostgreSQL si disponible
    if (getDbStatus()) {
      try {
        const dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: cleanEmail,
            passwordHash,
            fullName: cleanName,
            phone: cleanPhone,
            role: "CLIENT",
            wilayaCode: wilayaNum,
            wilayaName,
            address: cleanAddress || null
          }
        });
        createdUser = {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          phone: dbUser.phone,
          role: dbUser.role,
          wilayaCode: dbUser.wilayaCode,
          wilayaName: dbUser.wilayaName,
          address: dbUser.address,
          createdAt: dbUser.createdAt.toISOString()
        };
        console.log(`[PostgreSQL] Nouveau client inscrit : ${cleanEmail}`);
      } catch (err) {
        console.warn("[PostgreSQL] Erreur création utilisateur dans la BD:", err);
      }
    }

    // Sauvegarde mémoire de secours
    store.users.push({
      ...createdUser,
      passwordHash
    });

    // Génération du token JWT
    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      fullName: createdUser.fullName,
      role: createdUser.role,
      phone: createdUser.phone,
      wilayaCode: createdUser.wilayaCode
    });

    return res.status(201).json({
      success: true,
      message: "Compte client créé avec succès. Bienvenue !",
      token,
      user: createdUser
    });
  } catch (error: any) {
    console.error("[Auth Register Error]:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
};

/**
 * Connexion client (Login)
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { login: identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez saisir votre email ou numéro de téléphone et votre mot de passe."
      });
    }

    const cleanIdentifier = sanitizeString(identifier).trim();
    let user: any = null;
    let passwordHash: string | null = null;

    // 1. Recherche dans PostgreSQL
    if (getDbStatus()) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: cleanIdentifier, mode: "insensitive" } },
              { phone: cleanIdentifier }
            ]
          }
        });

        if (dbUser) {
          user = {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName,
            phone: dbUser.phone,
            role: dbUser.role,
            wilayaCode: dbUser.wilayaCode,
            wilayaName: dbUser.wilayaName,
            address: dbUser.address,
            createdAt: dbUser.createdAt.toISOString()
          };
          passwordHash = dbUser.passwordHash;
        }
      } catch (err) {
        console.warn("[PostgreSQL] Erreur recherche login:", err);
      }
    }

    // 2. Recherche en mémoire de secours
    if (!user) {
      const memUser = store.users.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
          u.phone === cleanIdentifier
      );
      if (memUser) {
        user = {
          id: memUser.id,
          email: memUser.email,
          fullName: memUser.fullName,
          phone: memUser.phone,
          role: memUser.role,
          wilayaCode: memUser.wilayaCode,
          wilayaName: memUser.wilayaName,
          address: memUser.address,
          createdAt: memUser.createdAt
        };
        passwordHash = memUser.passwordHash;
      }
    }

    if (!user || !passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects. Veuillez vérifier votre email ou mot de passe."
      });
    }

    // Vérification du mot de passe
    const isPasswordValid = await comparePassword(password, passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe incorrect."
      });
    }

    // Génération du token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      wilayaCode: user.wilayaCode
    });

    return res.json({
      success: true,
      message: `Bon retour parmi nous, ${user.fullName} !`,
      token,
      user
    });
  } catch (error: any) {
    console.error("[Auth Login Error]:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
};

/**
 * Récupère le profil complet du client connecté ainsi que l'historique de ses commandes
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Non autorisé" });
    }

    let user: any = null;
    let orders: any[] = [];

    // 1. Recherche dans PostgreSQL
    if (getDbStatus()) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (dbUser) {
          user = {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName,
            phone: dbUser.phone,
            role: dbUser.role,
            wilayaCode: dbUser.wilayaCode,
            wilayaName: dbUser.wilayaName,
            address: dbUser.address,
            createdAt: dbUser.createdAt.toISOString()
          };

          // Récupération des commandes associées au client (par clientId ou par son téléphone)
          const dbOrders = await prisma.order.findMany({
            where: {
              OR: [
                { clientId: dbUser.id },
                { customerPhone: dbUser.phone }
              ]
            },
            include: {
              customization: true,
              trackingSteps: { orderBy: { stepOrder: "asc" } }
            },
            orderBy: { createdAt: "desc" }
          });

          orders = dbOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            artisanId: o.artisanId,
            artisanName: store.artisans.find((a) => a.id === o.artisanId)?.storeName || "Atelier Pâtisserie",
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            deliveryWilayaCode: o.deliveryWilayaCode,
            deliveryWilayaName: o.deliveryWilayaName,
            deliveryAddress: o.deliveryAddress,
            eventDate: o.eventDate.toISOString(),
            status: o.status,
            totalPriceDZD: o.totalPriceDZD,
            createdAt: o.createdAt.toISOString(),
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
        }
      } catch (err) {
        console.warn("[PostgreSQL] Erreur lecture profil:", err);
      }
    }

    // 2. Recherche en mémoire de secours
    if (!user) {
      const memUser = store.users.find((u) => u.id === userId);
      if (memUser) {
        user = {
          id: memUser.id,
          email: memUser.email,
          fullName: memUser.fullName,
          phone: memUser.phone,
          role: memUser.role,
          wilayaCode: memUser.wilayaCode,
          wilayaName: memUser.wilayaName,
          address: memUser.address,
          createdAt: memUser.createdAt
        };
        orders = store.orders.filter(
          (o) => o.clientId === userId || o.customerPhone === memUser.phone
        );
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    return res.json({
      success: true,
      user,
      orders
    });
  } catch (error: any) {
    console.error("[Get Profile Error]:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
};

/**
 * Mise à jour des informations de profil
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Non autorisé" });
    }

    const { fullName, phone, wilayaCode, address, newPassword } = req.body;

    const cleanName = fullName ? sanitizeString(fullName) : undefined;
    const cleanPhone = phone ? sanitizeString(phone).replace(/[\s\.-]/g, "") : undefined;
    const cleanAddress = address !== undefined ? sanitizeString(address) : undefined;

    let wilayaName: string | undefined = undefined;
    if (wilayaCode) {
      const w = store.wilayas.find((item) => item.code === Number(wilayaCode));
      if (w) wilayaName = w.name;
    }

    let updatedPasswordHash: string | undefined = undefined;
    if (newPassword) {
      if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Le nouveau mot de passe doit contenir au moins 6 caractères."
        });
      }
      updatedPasswordHash = await hashPassword(newPassword);
    }

    let updatedUser: any = null;

    if (getDbStatus()) {
      try {
        const dbUser = await prisma.user.update({
          where: { id: userId },
          data: {
            fullName: cleanName,
            phone: cleanPhone,
            wilayaCode: wilayaCode ? Number(wilayaCode) : undefined,
            wilayaName,
            address: cleanAddress,
            passwordHash: updatedPasswordHash
          }
        });

        updatedUser = {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          phone: dbUser.phone,
          role: dbUser.role,
          wilayaCode: dbUser.wilayaCode,
          wilayaName: dbUser.wilayaName,
          address: dbUser.address,
          createdAt: dbUser.createdAt.toISOString()
        };
      } catch (err) {
        console.warn("[PostgreSQL] Erreur mise à jour profil:", err);
      }
    }

    // Mise à jour mémoire
    const memIdx = store.users.findIndex((u) => u.id === userId);
    if (memIdx !== -1) {
      store.users[memIdx] = {
        ...store.users[memIdx],
        ...(cleanName && { fullName: cleanName }),
        ...(cleanPhone && { phone: cleanPhone }),
        ...(wilayaCode && { wilayaCode: Number(wilayaCode), wilayaName }),
        ...(cleanAddress !== undefined && { address: cleanAddress }),
        ...(updatedPasswordHash && { passwordHash: updatedPasswordHash })
      };
      if (!updatedUser) {
        updatedUser = {
          id: store.users[memIdx].id,
          email: store.users[memIdx].email,
          fullName: store.users[memIdx].fullName,
          phone: store.users[memIdx].phone,
          role: store.users[memIdx].role,
          wilayaCode: store.users[memIdx].wilayaCode,
          wilayaName: store.users[memIdx].wilayaName,
          address: store.users[memIdx].address,
          createdAt: store.users[memIdx].createdAt
        };
      }
    }

    return res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });
  } catch (error: any) {
    console.error("[Update Profile Error]:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
  }
};
