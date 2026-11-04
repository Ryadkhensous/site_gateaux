import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { OrderItem, ArtisanProfile, Product } from '../types';
import { INITIAL_ARTISANS, INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/initialData';

const BACKEND_URL = ((import.meta as any).env?.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://patisserie-dz-db.onrender.com');
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
    selectArtisan(artisanId: string) {
      if (this.socket && this.selectedArtisanId) {
        this.socket.emit('leave_artisan', this.selectedArtisanId);
      }
      this.selectedArtisanId = artisanId;
      if (this.socket) {
        this.socket.emit('join_artisan', artisanId);
      }
    },

    async init() {
      await this.loadArtisanProfile(this.selectedArtisanId);
      await this.loadOrders();
      await this.loadProducts();
      this.initSocket();
    },

    initSocket() {
      if (this.socket) return;
      try {
        this.socket = io(BACKEND_URL, {
          transports: ['websocket', 'polling'],
          timeout: 5000,
          reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
          console.log('[Vue Admin Socket] Connecté au serveur WebSocket');
          this.socket?.emit('join_artisan', this.selectedArtisanId);
        });

        this.socket.on('new_order', (newOrder: OrderItem) => {
          console.log('[Vue Admin Socket] Nouvelle commande reçue :', newOrder);
          const exists = this.orders.some(o => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
          if (!exists) {
            this.orders.unshift(newOrder);
            this.saveOrdersToStorage();
          }
        });

        this.socket.on('order_updated', (updatedOrder: OrderItem) => {
          const idx = this.orders.findIndex((o) => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
          if (idx !== -1) {
            this.orders[idx] = updatedOrder;
            this.saveOrdersToStorage();
          }
        });
      } catch (err) {
        console.warn('[Socket.io connection non critique]:', err);
      }
    },

    saveOrdersToStorage() {
      try {
        localStorage.setItem(`artisan_orders_${this.selectedArtisanId}`, JSON.stringify(this.orders));
      } catch {}
    },

    async loadOrders() {
      this.loading = true;
      try {
        const res = await fetch(`${API_BASE}/orders?artisanId=${this.selectedArtisanId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            this.orders = data.data;
            this.saveOrdersToStorage();
            return;
          }
        }
      } catch (err) {
        console.warn('Serveur distant en cours de réveil ou indisponible, utilisation du cache local');
      } finally {
        this.loading = false;
      }

      // 1. Essai de charger depuis le cache local (localStorage)
      try {
        const cached = localStorage.getItem(`artisan_orders_${this.selectedArtisanId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.orders = parsed;
            return;
          }
        }
      } catch {}

      // 2. Fallback avec les commandes démos initiales riches
      this.orders = INITIAL_ORDERS.filter(o => o.artisanId === this.selectedArtisanId);
      this.saveOrdersToStorage();
    },

    async loadArtisanProfile(artisanId: string) {
      try {
        const res = await fetch(`${API_BASE}/artisans/${artisanId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            this.currentArtisan = data.data;
            return;
          }
        }
      } catch (err) {
        console.warn('Profil artisan chargé depuis les données locales');
      }
      this.currentArtisan = INITIAL_ARTISANS.find(a => a.id === artisanId) || INITIAL_ARTISANS[0];
    },

    async loadProducts() {
      try {
        const res = await fetch(`${API_BASE}/products?artisanId=${this.selectedArtisanId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            this.products = data.data;
            return;
          }
        }
      } catch (err) {
        console.warn('Produits chargés depuis les données locales');
      }
      this.products = INITIAL_PRODUCTS.filter(p => p.artisanId === this.selectedArtisanId);
    },

    async updateOrderStep(orderId: string, stepId: number, status: string, photoProofUrl?: string, note?: string) {
      // Mise à jour immédiate locale dans l'état réactif
      const idx = this.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
      if (idx !== -1) {
        const order = { ...this.orders[idx] };
        order.status = status as any;
        if (order.trackingSteps) {
          order.trackingSteps = order.trackingSteps.map((step) => {
            if (step.stepId === stepId) {
              return {
                ...step,
                completed: true,
                completedAt: new Date().toISOString(),
                photoProofUrl: photoProofUrl || step.photoProofUrl,
                description: note || step.description
              };
            }
            return step;
          });
        }
        this.orders[idx] = order;
        this.saveOrdersToStorage();
      }

      // Synchronisation avec l'API si le backend est joignable
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

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && idx !== -1) {
            this.orders[idx] = data.data;
            this.saveOrdersToStorage();
          }
        }
      } catch {
        // La mise à jour locale a déjà réussi
      }

      return { success: true };
    },

    async addNewProduct(productData: Partial<Product>) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        artisanId: this.selectedArtisanId,
        name: productData.name || 'كعكة جديدة',
        nameAr: productData.nameAr || productData.name || 'كعكة جديدة',
        category: productData.category || 'MODERNE',
        categoryAr: productData.categoryAr || 'عصري وفاخر',
        description: productData.description || '',
        descriptionAr: productData.descriptionAr || productData.description || '',
        priceDZD: productData.priceDZD || 5000,
        servings: productData.servings || 10,
        prepTimeDays: productData.prepTimeDays || 2,
        imageUrl: productData.imageUrl || '/images/hero_wedding_cake.jpg',
        isCustomizable: productData.isCustomizable ?? true,
        tags: productData.tags || ['جديد', 'فاخر']
      };

      this.products.unshift(newProd);

      try {
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            artisanId: this.selectedArtisanId
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            this.products[0] = data.data;
          }
        }
      } catch {
        // Enregistrement local garanti
      }

      return { success: true };
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
            if (res.ok) {
              const json = await res.json();
              if (json.success && json.url) {
                resolve({ success: true, url: json.url });
                return;
              }
            }
          } catch (err) {
            console.warn('[Upload fallback to Base64 Data URL]:', err);
          }
          // Fallback direct sur Data URL en cas de coupure réseau
          resolve({ success: true, url: dataUrl });
        };
        reader.readAsDataURL(file);
      });
    }
  }
});
