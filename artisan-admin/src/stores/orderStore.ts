import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { OrderItem, ArtisanProfile, Product, InventoryItem, CustomerItem, ArtisanSettings } from '../types';
import { INITIAL_ARTISANS, INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_INVENTORY } from '../data/initialData';

const BACKEND_URL = ((import.meta as any).env?.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://patisserie-dz-db.onrender.com');
const API_BASE = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as OrderItem[],
    currentArtisan: null as ArtisanProfile | null,
    products: [] as Product[],
    inventory: [] as InventoryItem[],
    settings: {
      storeName: 'حلويات العاصمة الفاخرة',
      chefName: 'ياسمين بن علي',
      phone: '0550 12 34 56',
      whatsappNumber: '213550123456',
      wilayaCode: 16,
      address: 'حيدرة، الجزائر العاصمة',
      bio: 'حرفية معتمدة ومتخصصة في كعكات الأعراس الملكية والحلويات المصنوعة يدوياً بورق الذهب عيار 24 قيراط وتصاميم ثلاثية الأبعاد.',
      dailyCapacity: 5,
      acceptCash: true,
      acceptBaridiMob: true,
      baridiMobRip: '00799999000123456789',
      acceptCIB: true,
      isVacationMode: false
    } as ArtisanSettings,
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
    },

    // قائمة العملاء المستخلصة مع إحصائياتهم
    customers: (state): CustomerItem[] => {
      const map = new Map<string, CustomerItem>();
      state.orders.forEach((o) => {
        const key = o.customerPhone || o.customerName;
        if (!key) return;

        if (!map.has(key)) {
          map.set(key, {
            id: `cust-${key.replace(/\s+/g, '')}`,
            name: o.customerName || 'زبون معتمد',
            phone: o.customerPhone,
            wilayaCode: o.deliveryWilayaCode,
            wilayaName: o.deliveryWilayaName,
            address: o.deliveryAddress,
            totalOrders: 0,
            totalSpentDZD: 0,
            lastOrderDate: o.eventDate || o.createdAt,
            isVIP: false
          });
        }

        const client = map.get(key)!;
        client.totalOrders += 1;
        if (o.status !== 'CANCELLED') {
          client.totalSpentDZD += o.totalPriceDZD || 0;
        }
        if (new Date(o.eventDate) > new Date(client.lastOrderDate)) {
          client.lastOrderDate = o.eventDate;
        }
      });

      const list = Array.from(map.values());
      list.forEach((c) => {
        c.isVIP = c.totalOrders >= 2 || c.totalSpentDZD >= 20000;
      });

      return list.sort((a, b) => b.totalSpentDZD - a.totalSpentDZD);
    },

    // عدد المواد التي أوشكت على النفاد
    lowStockItemsCount: (state) => {
      return state.inventory.filter((item) => item.currentStock <= item.minThreshold).length;
    },

    // القيمة الإجمالية للمخزون بالدينار
    totalInventoryValueDZD: (state) => {
      return state.inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnitDZD, 0);
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
      await this.loadInventory();
      await this.loadSettings();
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

    // ==========================================
    // إدارة المخزون والمواد الأولية (Inventory)
    // ==========================================
    saveInventoryToStorage() {
      try {
        localStorage.setItem(`artisan_inventory_${this.selectedArtisanId}`, JSON.stringify(this.inventory));
      } catch {}
    },

    loadInventory() {
      try {
        const cached = localStorage.getItem(`artisan_inventory_${this.selectedArtisanId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.inventory = parsed;
            return;
          }
        }
      } catch {}

      // Fallback avec les données initiales
      const defaults = INITIAL_INVENTORY.filter((item) => item.artisanId === this.selectedArtisanId);
      this.inventory = defaults.length > 0 ? defaults : INITIAL_INVENTORY.slice(0, 6);
      this.saveInventoryToStorage();
    },

    updateInventoryStock(id: string, newStock: number) {
      const idx = this.inventory.findIndex((item) => item.id === id);
      if (idx !== -1) {
        this.inventory[idx].currentStock = Math.max(0, Math.round(newStock * 10) / 10);
        this.inventory[idx].lastUpdated = new Date().toISOString().split('T')[0];
        this.saveInventoryToStorage();
      }
    },

    addInventoryItem(itemData: Partial<InventoryItem>) {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        artisanId: this.selectedArtisanId,
        name: itemData.name || 'مادة أولية جديدة',
        category: itemData.category || 'مكسرات ولوز',
        currentStock: Number(itemData.currentStock) || 10,
        unit: itemData.unit || 'كغ',
        minThreshold: Number(itemData.minThreshold) || 3,
        costPerUnitDZD: Number(itemData.costPerUnitDZD) || 1000,
        supplierName: itemData.supplierName || 'مورد معتمد',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      this.inventory.unshift(newItem);
      this.saveInventoryToStorage();
      return newItem;
    },

    deleteInventoryItem(id: string) {
      this.inventory = this.inventory.filter((item) => item.id !== id);
      this.saveInventoryToStorage();
    },

    // ==========================================
    // إدارة الكتالوج والمنتجات (Product Management)
    // ==========================================
    updateProduct(id: string, updatedFields: Partial<Product>) {
      const idx = this.products.findIndex((p) => p.id === id);
      if (idx !== -1) {
        this.products[idx] = {
          ...this.products[idx],
          ...updatedFields
        };
      }
    },

    deleteProduct(id: string) {
      this.products = this.products.filter((p) => p.id !== id);
    },

    // ==========================================
    // إعدادات الورشة والحساب (Settings)
    // ==========================================
    saveSettingsToStorage() {
      try {
        localStorage.setItem(`artisan_settings_${this.selectedArtisanId}`, JSON.stringify(this.settings));
      } catch {}
    },

    loadSettings() {
      try {
        const cached = localStorage.getItem(`artisan_settings_${this.selectedArtisanId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            this.settings = { ...this.settings, ...parsed };
            return;
          }
        }
      } catch {}

      if (this.currentArtisan) {
        this.settings.storeName = this.currentArtisan.storeNameAr || this.currentArtisan.storeName;
        this.settings.chefName = this.currentArtisan.nameAr || this.currentArtisan.name;
        this.settings.phone = this.currentArtisan.phone;
        this.settings.address = this.currentArtisan.address;
        this.settings.wilayaCode = this.currentArtisan.wilayaCode;
        this.settings.bio = this.currentArtisan.bioAr || this.currentArtisan.bio;
        this.saveSettingsToStorage();
      }
    },

    updateSettings(newSettings: Partial<ArtisanSettings>) {
      this.settings = { ...this.settings, ...newSettings };
      this.saveSettingsToStorage();
      if (this.currentArtisan) {
        if (newSettings.storeName) this.currentArtisan.storeName = newSettings.storeName;
        if (newSettings.chefName) this.currentArtisan.name = newSettings.chefName;
        if (newSettings.phone) this.currentArtisan.phone = newSettings.phone;
        if (newSettings.address) this.currentArtisan.address = newSettings.address;
        if (newSettings.bio) this.currentArtisan.bio = newSettings.bio;
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
