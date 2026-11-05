<script setup lang="ts">
import { useOrderStore } from '../stores/orderStore';
import { ChefHat, ShoppingBag, Store, BarChart3, ExternalLink, ShieldCheck } from 'lucide-vue-next';

const props = defineProps<{
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
};
</script>

<template>
  <aside class="w-64 bg-[#3D2D20] text-beige-200 flex flex-col justify-between border-l border-dore-600/30 p-4 text-right">
    <div class="space-y-6">
      <!-- الشعار والعنوان -->
      <div class="flex items-center gap-3 px-2 pt-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-dore-500 to-rose-400 flex items-center justify-center text-white shadow-md">
          <ChefHat class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-base font-bold text-white font-serif tracking-tight">ورشة الحرفي</h2>
          <span class="text-[10px] uppercase tracking-wider text-dore-300 font-sans font-semibold block">
            لوحة الإدارة والتحكم
          </span>
        </div>
      </div>

      <!-- محدد المتجر والورشة -->
      <div class="bg-[#4D3929] p-3 rounded-2xl border border-dore-500/30">
        <label class="text-[10px] font-bold uppercase tracking-wider text-dore-300 block mb-1.5">
          الورشة المتصلة حالياً
        </label>
        <select
          :value="store.selectedArtisanId"
          @change="onArtisanChange"
          class="w-full bg-[#35261B] border border-dore-400/30 rounded-lg p-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-rose-400"
        >
          <option v-for="art in artisansList" :key="art.id" :value="art.id">
            {{ art.name }}
          </option>
        </select>
        <div v-if="store.currentArtisan" class="mt-2 flex items-center gap-1.5 text-[11px] text-dore-300 font-medium">
          <ShieldCheck class="w-3.5 h-3.5 text-rose-400" />
          <span>حرفي معتمد ومرخص رسمياً</span>
        </div>
      </div>

      <!-- روابط التنقل الرئيسية -->
      <nav class="space-y-1">
        <button
          @click="emit('change-view', 'orders')"
          :class="[
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
            currentView === 'orders'
              ? 'bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-md shadow-rose-900/30'
              : 'text-beige-300 hover:text-white hover:bg-white/5'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <ShoppingBag class="w-4 h-4" />
            <span>الطلبيات ومراحل التصنيع</span>
          </div>
          <span
            v-if="store.orders.length > 0"
            class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/30 text-dore-200"
          >
            {{ store.orders.length }}
          </span>
        </button>

        <button
          @click="emit('change-view', 'showcase')"
          :class="[
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
            currentView === 'showcase'
              ? 'bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-md shadow-rose-900/30'
              : 'text-beige-300 hover:text-white hover:bg-white/5'
          ]"
        >
          <Store class="w-4 h-4" />
          <span>معرض إبداعاتي وكتالوجي</span>
        </button>

        <button
          @click="emit('change-view', 'analytics')"
          :class="[
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
            currentView === 'analytics'
              ? 'bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-md shadow-rose-900/30'
              : 'text-beige-300 hover:text-white hover:bg-white/5'
          ]"
        >
          <BarChart3 class="w-4 h-4" />
          <span>الإيرادات والإحصائيات (دج)</span>
        </button>
      </nav>
    </div>

    <!-- رابط الانتقال إلى متجر الزبائن React -->
    <div class="pt-4 border-t border-dore-600/30 space-y-2">
      <a
        :href="clientWebUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between px-3 py-2.5 bg-[#4D3929] hover:bg-[#5C4533] text-dore-200 text-xs font-semibold rounded-xl border border-dore-500/30 transition-colors group"
      >
        <span class="flex items-center gap-2">
          <span>فتح متجر الزبائن (React)</span>
        </span>
        <ExternalLink class="w-3.5 h-3.5 text-dore-300 group-hover:text-white" />
      </a>
      <p class="text-[10px] text-beige-400 text-center font-light">
        منصة الحلويات الجزائرية v1.0
      </p>
    </div>
  </aside>
</template>
