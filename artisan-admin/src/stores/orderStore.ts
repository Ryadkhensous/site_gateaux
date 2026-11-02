import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { OrderItem, ArtisanProfile, Product } from '../types';

const BACKEND_URL = (import.meta.env.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://site-gateaux-backend.onrender.com');
const API_BASE = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as OrderItem[],
    currentArtisan: null as ArtisanProfile | null,
    products: [] as Product[],
    loading: false,
    selectedArtisanId: 'art-1',
    socket: null as Socket | null,
  }),

  getters: {
    totalRevenueDZD: (state) => {
      return state.orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + (o.totalPriceDZD || 0), 0);
    },
    pendingOrdersCount: (state) => {
      return state.orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PENDING').length;
    },
    inCraftingOrdersCount: (state) => {
      return state.orders.filter(
        (o) => o.status === 'PREPARING_BASE' || o.status === 'BAKING_ASSEMBLY' || o.status === 'DECORATING'
      ).length;
    },
    readyOrdersCount: (state) => {
      return state.orders.filter((o) => o.status === 'READY' || o.status === 'DELIVERING').length;
    },
    filteredOrders: (state) => {
      return state.orders.filter((o) => o.artisanId === state.selectedArtisanId);
    }
  },

  actions: {
    async init() {
      await this.loadArtisanProfile(this.selectedArtisanId);
      await this.loadOrders();
      await this.loadProducts();
      this.initSocket();
    },

    initSocket() {
      if (this.socket) return;
      this.socket = io(BACKEND_URL);

      this.socket.on('connect', () => {
        console.log('[Vue Admin Socket] Connecté au serveur WebSocket');
        this.socket?.emit('join_artisan', this.selectedArtisanId);
      });

      this.socket.on('new_order', (newOrder: OrderItem) => {
        console.log('[Vue Admin Socket] Nouvelle commande reçue :', newOrder);
        // Ajoute en tête si elle concerne cet artisan
        this.orders.unshift(newOrder);
      });

      this.socket.on('order_updated', (updatedOrder: OrderItem) => {
        const idx = this.orders.findIndex((o) => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
        if (idx !== -1) {
          this.orders[idx] = updatedOrder;
        }
      });
    },

    async loadOrders() {
      this.loading = true;
      try {
        const res = await fetch(`${API_BASE}/orders?artisanId=${this.selectedArtisanId}`);
        const data = await res.json();
        if (data.success && data.data) {
          this.orders = data.data;
        }
      } catch (err) {
        console.error('Erreur chargement commandes:', err);
      } finally {
        this.loading = false;
      }
    },

    async loadArtisanProfile(artisanId: string) {
      try {
        const res = await fetch(`${API_BASE}/artisans/${artisanId}`);
        const data = await res.json();
        if (data.success && data.data) {
          this.currentArtisan = data.data;
        }
      } catch (err) {
        console.error('Erreur profil artisan:', err);
      }
    },

    async loadProducts() {
      try {
        const res = await fetch(`${API_BASE}/products?artisanId=${this.selectedArtisanId}`);
        const data = await res.json();
        if (data.success && data.data) {
          this.products = data.data;
        }
      } catch (err) {
        console.error('Erreur chargement produits:', err);
      }
    },

    async updateOrderStep(orderId: string, stepId: number, status: string, photoProofUrl?: string, note?: string) {
      try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/step`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stepId,
            status,
            photoProofUrl,
            note
          })
        });

        const data = await res.json();
        if (data.success && data.data) {
          const idx = this.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
          if (idx !== -1) {
            this.orders[idx] = data.data;
          }
          return { success: true };
        }
        return { success: false, message: data.message };
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    async addNewProduct(productData: Partial<Product>) {
      try {
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            artisanId: this.selectedArtisanId
          })
        });
        const data = await res.json();
        if (data.success && data.data) {
          this.products.unshift(data.data);
          return { success: true };
        }
        return { success: false, message: data.message };
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    async uploadImage(file: File): Promise<{ success: boolean; url: string }> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          try {
            const res = await fetch(`${API_BASE}/upload`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: dataUrl,
                fileName: file.name
              })
            });
            const json = await res.json();
            if (json.success && json.url) {
              resolve({ success: true, url: json.url });
              return;
            }
          } catch (err) {
            console.warn('[Upload fallback to Base64 Data URL]:', err);
          }
          // Fallback to Data URL if offline or network error
          resolve({ success: true, url: dataUrl });
        };
        reader.onerror = () => {
          resolve({ success: false, url: '' });
        };
        reader.readAsDataURL(file);
      });
    }
  }
});

