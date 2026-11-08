<template>
  <aside class="w-64 bg-white text-slate-700 flex flex-col justify-between border-l border-slate-200 p-4 text-right h-screen shrink-0 shadow-xs" dir="rtl">
    <div class="space-y-5 overflow-y-auto pr-1">
      <!-- Logo & Brand Header -->
      <div class="flex items-center gap-3 px-2 pt-1">
        <div class="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
          <ChefHat class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-base font-black text-slate-900 tracking-tight">SweetBox DZ</h2>
          <span class="text-[10px] uppercase tracking-wider text-pink-600 font-bold block">
            بوابة الحرفيين والإدارة
          </span>
        </div>
      </div>

      <!-- Workshop Selector -->
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          الورشة النشطة حالياً
        </label>
        <select
          :value="store.selectedArtisanId"
          @change="onArtisanChange"
          class="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 shadow-2xs"
        >
          <option v-for="art in artisansList" :key="art.id" :value="art.id">
            {{ art.name }}
          </option>
        </select>
        <div v-if="store.currentArtisan" class="mt-2 flex items-center gap-1.5 text-[11px] text-pink-700 font-medium">
          <ShieldCheck class="w-3.5 h-3.5 text-pink-600 shrink-0" />
          <span class="truncate">حرفي معتمد ومرخص رسمياً</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1 text-xs font-semibold">
        <!-- 1. Orders -->
        <button
          @click="emit('change-view', 'orders')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'orders'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <ShoppingBag class="w-4 h-4" />
            <span>الطلبيات ومراحل الصنع</span>
          </div>
          <span
            v-if="store.orders.length > 0"
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-mono',
              currentView === 'orders' ? 'bg-pink-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
            ]"
          >
            {{ store.orders.length }}
          </span>
        </button>

        <!-- 2. Calendar / Production Schedule -->
        <button
          @click="emit('change-view', 'calendar')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'calendar'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <Calendar class="w-4 h-4" />
            <span>جدول الإنتاج والتسليم</span>
          </div>
        </button>

        <!-- 3. Showcase / Products -->
        <button
          @click="emit('change-view', 'showcase')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'showcase'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <Store class="w-4 h-4" />
            <span>كتالوج المعرض والحلويات</span>
          </div>
          <span
            v-if="store.products.length > 0"
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-mono',
              currentView === 'showcase' ? 'bg-pink-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
            ]"
          >
            {{ store.products.length }}
          </span>
        </button>

        <!-- 4. Customers CRM -->
        <button
          @click="emit('change-view', 'customers')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'customers'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <Users class="w-4 h-4" />
            <span>سجل الزبائن والعلاقات</span>
          </div>
          <span
            v-if="store.customers.length > 0"
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-mono',
              currentView === 'customers' ? 'bg-pink-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
            ]"
          >
            {{ store.customers.length }}
          </span>
        </button>

        <!-- 5. Raw Materials Inventory -->
        <button
          @click="emit('change-view', 'inventory')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'inventory'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <Boxes class="w-4 h-4" />
            <span>مخزون المواد الأولية</span>
          </div>
          <span
            v-if="store.lowStockItemsCount > 0"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
          >
            {{ store.lowStockItemsCount }} تنبيه
          </span>
        </button>

        <!-- 6. Analytics -->
        <button
          @click="emit('change-view', 'analytics')"
          :class="[
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'analytics'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <BarChart3 class="w-4 h-4" />
          <span>الإيرادات والإحصائيات</span>
        </button>

        <!-- 7. Settings -->
        <button
          @click="emit('change-view', 'settings')"
          :class="[
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all',
            currentView === 'settings'
              ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <Settings class="w-4 h-4" />
          <span>إعدادات الورشة والحساب</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Footer: Link to Client Store -->
    <div class="pt-4 border-t border-slate-200 space-y-2 shrink-0">
      <a
        :href="clientWebUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-pink-300 transition-all group"
      >
        <span class="flex items-center gap-2">
          <span>متجر الزبائن SweetBox DZ</span>
        </span>
        <ExternalLink class="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
      </a>
      <p class="text-[10px] text-slate-400 text-center font-light">
        منصة الحلويات الفاخرة بالجزائر 2026
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useOrderStore } from '../stores/orderStore';
import {
  ChefHat,
  ShoppingBag,
  Calendar,
  Store,
  Users,
  Boxes,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldCheck
} from 'lucide-vue-next';

defineProps<{
  currentView: string;
}>();

const emit = defineEmits<{
  (e: 'change-view', view: string): void;
}>();

const store = useOrderStore();

const artisansList = [
  { id: 'art-1', name: "حلويات العاصمة الفاخرة - ياسمين بن علي (الجزائر - 16)" },
  { id: 'art-2', name: "قصر الحلويات القسنطينية - كريم جبار (قسنطينة - 25)" },
  { id: 'art-3', name: "إبداعات سويت وهران - أميرة منصوري (وهران - 31)" }
];

const clientWebUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5173'
  : 'https://client-web-flax.vercel.app';

const onArtisanChange = async (e: Event) => {
  const target = e.target as HTMLSelectElement;
  store.selectArtisan(target.value);
  await store.loadArtisanProfile(target.value);
  await store.loadOrders();
  await store.loadProducts();
  await store.loadInventory();
  await store.loadSettings();
};
</script>
