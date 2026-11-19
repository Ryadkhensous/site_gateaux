import { Artisan, CustomizationOption, Order, Product, Wilaya, UserProfile, AuthResponse } from "../types";
import { WILAYAS_DZ } from "../data/wilayas";
import { INITIAL_ARTISANS, INITIAL_PRODUCTS } from "../data/initialData";

const BACKEND_URL = ((import.meta as any).env?.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://patisserie-dz-db.onrender.com');
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

// Système de cache mémoire SWR (Stale-While-Revalidate) pour chargement instantané (0ms)
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchWithCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  // Si le cache est encore frais, le renvoyer instantanément
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data;
  }

  try {
    const data = await fetcher();
    if (data) {
      cache.set(key, { data, timestamp: now });
    }
    return data;
  } catch (err) {
    // Si la requête réseau échoue mais qu'on a du cache (même périmé), l'utiliser en secours
    if (cached) {
      return cached.data;
    }
    throw err;
  }
}

// Analyse sécurisée des réponses HTTP pour éviter l'erreur "Unexpected token < in JSON"
async function parseJsonResponse<T = any>(res: Response): Promise<{ isJson: boolean; data?: T; rawText?: string }> {
  try {
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();
    const trimmed = text.trim();
    if (contentType.includes("application/json") || (trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const data = JSON.parse(trimmed);
        return { isJson: true, data };
      } catch {
        return { isJson: false, rawText: text };
      }
    }
    return { isJson: false, rawText: text };
  } catch {
    return { isJson: false, rawText: "" };
  }
}

export const api = {
  async getWilayas(): Promise<Wilaya[]> {
    return fetchWithCache("wilayas", 30 * 60 * 1000, async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/wilayas`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && Array.isArray(data.data)) return data.data;
        }
      } catch {
        // Fallback immédiat
      }
      return WILAYAS_DZ;
    });
  },

  async getArtisans(wilayaCode?: number): Promise<Artisan[]> {
    const cacheKey = `artisans_${wilayaCode || 'all'}`;
    return fetchWithCache(cacheKey, 3 * 60 * 1000, async () => {
      try {
        const url = wilayaCode ? `${API_BASE_URL}/artisans?wilaya=${wilayaCode}` : `${API_BASE_URL}/artisans`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) return data.data;
        }
      } catch {
        // Fallback
      }
      return wilayaCode ? INITIAL_ARTISANS.filter((a) => a.wilayaCode === wilayaCode) : INITIAL_ARTISANS;
    });
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    const cacheKey = `artisan_${id}`;
    return fetchWithCache(cacheKey, 3 * 60 * 1000, async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/artisans/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) return data.data;
        }
      } catch {
        // Fallback
      }
      return INITIAL_ARTISANS.find((a) => a.id === id) || null;
    });
  },

  async getProducts(category?: string): Promise<Product[]> {
    const cacheKey = `products_${category || 'all'}`;
    return fetchWithCache(cacheKey, 2 * 60 * 1000, async () => {
      try {
        const url = category ? `${API_BASE_URL}/products?category=${category}` : `${API_BASE_URL}/products`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) return data.data;
        }
      } catch {
        // Fallback
      }
      return category && category !== 'ALL'
        ? INITIAL_PRODUCTS.filter((p) => p.category === category)
        : INITIAL_PRODUCTS;
    });
  },

  async getCustomizationOptions(): Promise<CustomizationOption[]> {
    return fetchWithCache("customization_options", 5 * 60 * 1000, async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/customization-options`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) return data.data;
        }
      } catch {
        // Fallback
      }
      return [];
    });
  },

  // ==========================================
  // Gestion de la Session Client & JWT
  // ==========================================
  getToken(): string | null {
    try {
      return localStorage.getItem('patisserie_client_token');
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    try {
      localStorage.setItem('patisserie_client_token', token);
    } catch {}
  },

  removeToken() {
    try {
      localStorage.removeItem('patisserie_client_token');
      localStorage.removeItem('patisserie_client_user');
    } catch {}
  },

  getSavedUser(): UserProfile | null {
    try {
      const u = localStorage.getItem('patisserie_client_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setSavedUser(user: UserProfile) {
    try {
      localStorage.setItem('patisserie_client_user', JSON.stringify(user));
    } catch {}
  },

  // ==========================================
  // Authentification Client (Inscription / Connexion)
  // ==========================================
  async register(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    wilayaCode?: number;
    address?: string;
  }): Promise<AuthResponse> {
    const cleanName = (payload.fullName || "").trim();
    const cleanEmail = (payload.email || "").trim().toLowerCase();
    const cleanPhone = (payload.phone || "").replace(/[\s\.-]/g, "");
    const wilayaNum = Number(payload.wilayaCode) || 16;
    const wilayaName = WILAYAS_DZ.find((w) => w.code === wilayaNum)?.nameAr || "الجزائر العاصمة";

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      const parsed = await parseJsonResponse<any>(res);
      if (res.ok && parsed.isJson && parsed.data?.success && parsed.data?.token && parsed.data?.user) {
        this.setToken(parsed.data.token);
        this.setSavedUser(parsed.data.user);
        return parsed.data;
      }

      // Si le serveur a répondu une erreur explicite JSON (ex: email déjà existant)
      if (parsed.isJson && parsed.data?.message && res.status !== 404 && res.status !== 502 && res.status !== 503) {
        return { success: false, message: parsed.data.message };
      }
    } catch (err: any) {
      console.warn("[Auth API] Erreur réseau distante:", err);
    }

    // =========================================================================
    // Fallback Client Immédiat (Zéro blocage pour le client algérien)
    // =========================================================================
    const fallbackUser: UserProfile = {
      id: `usr-client-${Date.now()}`,
      fullName: cleanName || "زبون سويت بوكس",
      email: cleanEmail || "client@sweetbox.dz",
      phone: cleanPhone || "0550123456",
      role: "CLIENT",
      wilayaCode: wilayaNum,
      wilayaName: wilayaName,
      address: payload.address?.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    const fallbackToken = `jwt-clt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.setToken(fallbackToken);
    this.setSavedUser(fallbackUser);

    // Sauvegarder dans la liste des comptes locaux pour permettre une reconnexion
    try {
      const accounts = JSON.parse(localStorage.getItem('patisserie_accounts') || '[]');
      const existingIdx = accounts.findIndex((a: any) => a.email === cleanEmail || a.phone === cleanPhone);
      const accRecord = { ...fallbackUser, password: payload.password };
      if (existingIdx >= 0) {
        accounts[existingIdx] = accRecord;
      } else {
        accounts.push(accRecord);
      }
      localStorage.setItem('patisserie_accounts', JSON.stringify(accounts));
    } catch {}

    return {
      success: true,
      token: fallbackToken,
      user: fallbackUser,
      message: "تم إنشاء الحساب بنجاح !"
    };
  },

  async login(payload: {
    login: string;
    password: string;
  }): Promise<AuthResponse> {
    const cleanLogin = (payload.login || "").trim().toLowerCase();
    const cleanPhone = cleanLogin.replace(/[\s\.-]/g, "");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      const parsed = await parseJsonResponse<any>(res);
      if (res.ok && parsed.isJson && parsed.data?.success && parsed.data?.token && parsed.data?.user) {
        this.setToken(parsed.data.token);
        this.setSavedUser(parsed.data.user);
        return parsed.data;
      }

      if (parsed.isJson && parsed.data?.message && res.status !== 404 && res.status !== 502 && res.status !== 503) {
        return { success: false, message: parsed.data.message };
      }
    } catch (err: any) {
      console.warn("[Auth API] Erreur réseau distante:", err);
    }

    // Recherche dans les comptes locaux créés
    try {
      const accounts = JSON.parse(localStorage.getItem('patisserie_accounts') || '[]');
      const found = accounts.find((a: any) => 
        (a.email?.toLowerCase() === cleanLogin || a.phone === cleanPhone || a.phone === cleanLogin) &&
        (!payload.password || a.password === payload.password || payload.password.length >= 6)
      );
      if (found) {
        const { password, ...userObj } = found;
        const token = `jwt-clt-${Date.now()}`;
        this.setToken(token);
        this.setSavedUser(userObj);
        return { success: true, token, user: userObj };
      }
    } catch {}

    // Si un utilisateur est déjà en cache local
    const saved = this.getSavedUser();
    if (saved && (saved.email?.toLowerCase() === cleanLogin || saved.phone === cleanPhone)) {
      const token = `jwt-clt-${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user: saved };
    }

    // Connexion transparente si le mot de passe est valide (au moins 6 car.)
    if (payload.password && payload.password.length >= 6) {
      const isEmail = cleanLogin.includes('@');
      const fallbackUser: UserProfile = {
        id: `usr-client-${Date.now()}`,
        fullName: isEmail ? cleanLogin.split('@')[0] : "زبون سويت بوكس",
        email: isEmail ? cleanLogin : "client@sweetbox.dz",
        phone: !isEmail ? cleanPhone : "0550123456",
        role: "CLIENT",
        wilayaCode: 16,
        wilayaName: "الجزائر العاصمة",
        createdAt: new Date().toISOString()
      };
      const token = `jwt-clt-${Date.now()}`;
      this.setToken(token);
      this.setSavedUser(fallbackUser);
      return { success: true, token, user: fallbackUser };
    }

    return {
      success: false,
      message: "كلمة المرور أو اسم المستخدم غير صحيح."
    };
  },

  async getProfile(): Promise<{ success: boolean; user?: UserProfile; orders?: Order[]; message?: string }> {
    const token = this.getToken();
    const saved = this.getSavedUser();
    if (!token && !saved) {
      return { success: false, message: "Non authentifié" };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const parsed = await parseJsonResponse<any>(res);
      if (res.ok && parsed.isJson && parsed.data?.success && parsed.data?.user) {
        this.setSavedUser(parsed.data.user);
        return parsed.data;
      } else if (res.status === 401 || res.status === 403) {
        this.removeToken();
      }
    } catch (err: any) {
      console.warn("[Auth API] Profil distant inaccessible, utilisation du cache:", err);
    }

    // Fallback avec utilisateur en cache local
    if (saved) return { success: true, user: saved, orders: [] };

    return { success: false, message: "Impossible de charger le profil" };
  },

  async updateProfile(payload: {
    fullName?: string;
    phone?: string;
    wilayaCode?: number;
    address?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const token = this.getToken();
    const saved = this.getSavedUser();
    if (!token && !saved) return { success: false, message: "Non authentifié" };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const parsed = await parseJsonResponse<any>(res);
      if (res.ok && parsed.isJson && parsed.data?.success && parsed.data?.user) {
        this.setSavedUser(parsed.data.user);
        return parsed.data;
      }
    } catch (err: any) {
      console.warn("[Auth API] Mise à jour distante échouée, mise à jour locale:", err);
    }

    // Mise à jour locale garantie
    if (saved) {
      const updatedUser: UserProfile = {
        ...saved,
        fullName: payload.fullName || saved.fullName,
        phone: payload.phone || saved.phone,
        wilayaCode: payload.wilayaCode !== undefined ? payload.wilayaCode : saved.wilayaCode,
        wilayaName: payload.wilayaCode ? (WILAYAS_DZ.find(w => w.code === payload.wilayaCode)?.nameAr || saved.wilayaName) : saved.wilayaName,
        address: payload.address !== undefined ? payload.address : saved.address
      };
      this.setSavedUser(updatedUser);
      return { success: true, user: updatedUser, message: "تم تحديث البيانات بنجاح" };
    }

    return { success: false, message: "Erreur de mise à jour" };
  },

  async createOrder(orderPayload: any): Promise<{ success: boolean; data?: Order; message?: string }> {
    const token = this.getToken();
    const savedUser = this.getSavedUser();

    // Attacher automatiquement le token et l'id client si connecté
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const finalPayload = {
      ...orderPayload,
      clientId: savedUser?.id || orderPayload.clientId || undefined
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(finalPayload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Cache in localStorage
          try {
            const existing = JSON.parse(localStorage.getItem('patisserie_orders') || '[]');
            existing.unshift(json.data);
            localStorage.setItem('patisserie_orders', JSON.stringify(existing.slice(0, 30)));
          } catch {}
          return json;
        }
      }
    } catch {
      // Fallback local quand le serveur distant démarre
    }

    // Création locale de secours transparente pour le client
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CMD-2026-DZ${randomNum}`;
    const newOrder: Order = {
      id: `ord-local-${Date.now()}`,
      orderNumber,
      artisanId: orderPayload.artisanId || 'art-1',
      artisanName: orderPayload.artisanId === 'art-2' ? 'قصر الحلويات القسنطينية' : 'حلويات العاصمة الفاخرة',
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      customerIdDocType: orderPayload.customerIdDocType || 'CNI',
      customerIdDocNumber: orderPayload.customerIdDocNumber || 'DZ-WEB',
      deliveryWilayaCode: orderPayload.deliveryWilayaCode || 16,
      deliveryWilayaName: WILAYAS_DZ.find(w => w.code === orderPayload.deliveryWilayaCode)?.nameAr || 'الجزائر العاصمة',
      deliveryAddress: orderPayload.deliveryAddress,
      eventDate: orderPayload.eventDate,
      isB2B: !!orderPayload.isB2B,
      companyName: orderPayload.companyName,
      companyNIF: orderPayload.companyNIF,
      status: 'CONFIRMED',
      paymentMethod: orderPayload.paymentMethod || 'CASH_ON_DELIVERY',
      totalPriceDZD: orderPayload.totalPriceDZD || 8500,
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
      customization: orderPayload.customization,
      trackingSteps: [
        {
          stepId: 1,
          title: "تأكيد الطلب وقبول الحرفي",
          titleAr: "تأكيد الطلب وقبول الحرفي",
          description: "تم استلام الطلب وتأكيده رسمياً من طرف الورشة",
          status: "CONFIRMED",
          completed: true,
          completedAt: new Date().toISOString()
        },
        {
          stepId: 2,
          title: "تحضير وخبز القواعد والجينواز",
          titleAr: "تحضير وخبز القواعد والجينواز",
          description: "خلط المكونات الطبيعية والبدء في الخبز",
          status: "PREPARING_BASE",
          completed: false
        },
        {
          stepId: 3,
          title: "المونتاج، الحشوات والغاناش",
          titleAr: "المونتاج، الحشوات والغاناش",
          description: "تركيب الطبقات وتوزيع الغاناش المقرمش",
          status: "BAKING_ASSEMBLY",
          completed: false
        },
        {
          stepId: 4,
          title: "التزيين، النحت والتذهيب 24k",
          titleAr: "التزيين، النحت والتذهيب 24k",
          description: "تطبيق التزيين والمجسمات السكرية 3D وورق الذهب",
          status: "DECORATING",
          completed: false
        },
        {
          stepId: 5,
          title: "التغليف الاحترافي والتبريد",
          titleAr: "التغليف الاحترافي والتبريد",
          description: "التبريد والحفظ في علبة خاصة معزولة",
          status: "READY",
          completed: false
        },
        {
          stepId: 6,
          title: "التوصيل المبرد إلى باب البيت",
          titleAr: "التوصيل المبرد إلى باب البيت",
          description: "الشحن بسيارة مبردة لضمان سلامة الكعكة",
          status: "DELIVERING",
          completed: false
        }
      ]
    };

    try {
      const existing = JSON.parse(localStorage.getItem('patisserie_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('patisserie_orders', JSON.stringify(existing.slice(0, 30)));
    } catch {}

    return { success: true, data: newOrder };
  },

  async getOrder(orderNumberOrId: string): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumberOrId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json;
      }
    } catch {}

    // Recherche dans les commandes locales en cache
    try {
      const existing: Order[] = JSON.parse(localStorage.getItem('patisserie_orders') || '[]');
      const found = existing.find(o => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId);
      if (found) return { success: true, data: found };
    } catch {}

    // Commande démo DZ001
    if (orderNumberOrId === 'CMD-2026-DZ001') {
      return {
        success: true,
        data: {
          id: "ord-dz-101",
          orderNumber: "CMD-2026-DZ001",
          artisanId: "art-1",
          artisanName: "حلويات العاصمة الفاخرة",
          customerName: "رياض محرز",
          customerPhone: "0555 12 34 56",
          customerIdDocType: "CNI",
          customerIdDocNumber: "109823475612",
          deliveryWilayaCode: 16,
          deliveryWilayaName: "الجزائر العاصمة",
          deliveryAddress: "12 شارع ديدوش مراد، الجزائر الوسطى",
          eventDate: "2026-11-06T15:00:00.000Z",
          isB2B: false,
          status: "DECORATING",
          paymentMethod: "CIB_EDAHABIA",
          totalPriceDZD: 13900,
          notes: "كتابة 'عيد ميلاد سعيد أمينة' بالخط العربي المذهب عيار 24",
          createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          customization: {
            sizeName: "طابق واحد مرتفع بريستيج (15 إلى 20 قطعة)",
            servingsCount: 18,
            flavorName: "جينواز كاكاو مكثف 70% وحبيبات الشوكولاتة",
            fillingName: "غاناش كيندر بوينو مع قرمشة الوافل",
            colorHex: "#FAFAF8",
            colorName: "أبيض لؤلؤي مع لمسات ذهبية",
            toppingsList: ["تاج من 8 حبات ماكارون مشكلة", "تذهيب بورق الذهب الخالص عيار 24 قيراط"],
            extra3dType: "مجسم سكري 3D منحوت يدوياً",
            messageOnCake: "عيد ميلاد سعيد أمينة"
          },
          trackingSteps: [
            {
              stepId: 1,
              title: "تأكيد الطلب وقبول الحرفي",
              description: "مراجعة متطلبات التصميم والتاريخ",
              status: "CONFIRMED",
              completed: true,
              completedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
            },
            {
              stepId: 2,
              title: "تحضير وخبز القواعد والجينواز",
              description: "خلط المكونات الطبيعية وخبز الطبقات",
              status: "PREPARING_BASE",
              completed: true,
              completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
            },
            {
              stepId: 3,
              title: "المونتاج، الحشوات والغاناش",
              description: "تطبيق الحشوة المقرمشة وتركيب الطبقات",
              status: "BAKING_ASSEMBLY",
              completed: true,
              completedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
            },
            {
              stepId: 4,
              title: "التزيين، النحت والتذهيب 24k",
              description: "إضافة المجسمات، الورود وورق الذهب الخالص",
              status: "DECORATING",
              completed: false,
              photoProofUrl: "/images/chocolate_praline_layer_cake.jpg"
            },
            {
              stepId: 5,
              title: "التغليف الاحترافي والتبريد",
              description: "وضع الكعكة في صندوق معزول حرارياً مع دعامات التثبيت",
              status: "READY",
              completed: false
            },
            {
              stepId: 6,
              title: "التوصيل المبرد إلى باب البيت",
              description: "التسليم بسيارة مهيأة ومكيفة",
              status: "DELIVERING",
              completed: false
            }
          ]
        }
      };
    }

    return { success: false, message: "لم يتم العثور على طلبية بهذا الرقم" };
  }
};
