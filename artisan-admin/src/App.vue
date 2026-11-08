<template>
  <div class="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans" dir="rtl">
    <!-- Sidebar Navigation -->
    <Sidebar :currentView="currentView" @change-view="currentView = $event" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
      <!-- Top Bar -->
      <header class="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-900">{{ currentViewTitle }}</span>
            <span class="text-xs text-slate-300 font-normal">|</span>
            <span class="text-xs text-slate-500 font-medium">{{ store.settings.storeName || 'ورشة الحلويات' }}</span>
          </div>

          <!-- Vacation Mode Badge if active -->
          <span
            v-if="store.settings.isVacationMode"
            class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1"
          >
            <Clock class="w-3 h-3 text-amber-600" />
            وضع العطلة مفعّل
          </span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Low Stock Warning Pill -->
          <button
            v-if="store.lowStockItemsCount > 0"
            @click="currentView = 'inventory'"
            class="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold transition-colors"
          >
            <AlertTriangle class="w-3.5 h-3.5 text-amber-600" />
            <span>{{ store.lowStockItemsCount }} مواد شارفت على النفاد</span>
          </button>

          <!-- Chef Profile Chip -->
          <div class="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <div class="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs border border-pink-200">
              {{ (store.settings.chefName || 'ش').charAt(0) }}
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-slate-900 block leading-tight">{{ store.settings.chefName }}</span>
              <span class="text-[10px] text-slate-500 block leading-none">شيف الحلويات</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Main View Container -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/60">
        <div class="max-w-7xl mx-auto pb-10">
          <OrdersView v-if="currentView === 'orders'" />
          <CalendarView v-else-if="currentView === 'calendar'" />
          <ShowcaseView v-else-if="currentView === 'showcase'" />
          <CustomersView v-else-if="currentView === 'customers'" />
          <InventoryView v-else-if="currentView === 'inventory'" />
          <AnalyticsView v-else-if="currentView === 'analytics'" />
          <SettingsView v-else-if="currentView === 'settings'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from './stores/orderStore';
import Sidebar from './components/Sidebar.vue';

import OrdersView from './views/OrdersView.vue';
import CalendarView from './views/CalendarView.vue';
import ShowcaseView from './views/ShowcaseView.vue';
import CustomersView from './views/CustomersView.vue';
import InventoryView from './views/InventoryView.vue';
import AnalyticsView from './views/AnalyticsView.vue';
import SettingsView from './views/SettingsView.vue';

import { AlertTriangle, Clock } from 'lucide-vue-next';

const currentView = ref('orders');
const store = useOrderStore();

onMounted(async () => {
  await store.init();
});

const currentViewTitle = computed(() => {
  switch (currentView.value) {
    case 'orders':
      return 'سجل الطلبيات ومراحل الصنع';
    case 'calendar':
      return 'جدول الإنتاج والتسليم اليومي';
    case 'showcase':
      return 'كتالوج المعرض والحلويات';
    case 'customers':
      return 'سجل الزبائن والعلاقات (CRM)';
    case 'inventory':
      return 'مخزون المواد الأولية والمستلزمات';
    case 'analytics':
      return 'الأداء المالي والإحصائيات';
    case 'settings':
      return 'إعدادات الورشة والحساب';
    default:
      return 'لوحة التحكم';
  }
});
</script>
