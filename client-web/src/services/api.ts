import { Artisan, CustomizationOption, Order, Product, Wilaya } from "../types";
import { WILAYAS_DZ } from "../data/wilayas";

const BACKEND_URL = (import.meta.env.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://site-gateaux-backend.onrender.com');
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const api = {
  async getWilayas(): Promise<Wilaya[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/wilayas`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch {
      // fallback
    }
    return WILAYAS_DZ;
  },

  async getArtisans(wilayaCode?: number): Promise<Artisan[]> {
    try {
      const url = wilayaCode ? `${API_BASE_URL}/artisans?wilaya=${wilayaCode}` : `${API_BASE_URL}/artisans`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch {
      // fallback
    }
    return [];
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/artisans/${id}`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch {
      // fallback
    }
    return null;
  },

  async getProducts(category?: string): Promise<Product[]> {
    try {
      const url = category ? `${API_BASE_URL}/products?category=${category}` : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch {
      // fallback
    }
    return [];
  },

  async getCustomizationOptions(): Promise<CustomizationOption[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/customization-options`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch {
      // fallback
    }
    return [];
  },

  async createOrder(orderPayload: any): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Erreur de connexion au serveur" };
    }
  },

  async getOrder(orderNumberOrId: string): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumberOrId}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Impossible de récupérer la commande" };
    }
  }
};

