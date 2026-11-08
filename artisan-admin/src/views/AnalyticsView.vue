<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 class="w-7 h-7 text-pink-500" />
          الأداء المالي والإحصائيات التحليلية
        </h1>
        <p class="text-xs text-zinc-400 mt-1">
          متابعة رقم الأعمال بالدينار الجزائري (دج)، وتوزيع الطلبيات حسب الولايات وحجم معاملات الأفراد والشركات B2C / B2B
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <TrendingUp class="w-4 h-4" />
          <span>تحديث الحسابات الفوري بالدينار (DZD)</span>
        </span>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Revenue -->
      <div class="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400">إجمالي المداخيل</span>
          <div class="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center font-bold text-xs font-mono">
            دج
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-white">
          {{ formatPrice(totalRevenue) }} <span class="text-sm font-sans font-bold text-pink-400">دج</span>
        </div>
        <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp class="w-3.5 h-3.5" />
          طلبيات مؤكدة وقيد التصنيع بالورشة
        </span>
      </div>

      <!-- Orders Count -->
      <div class="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400">إجمالي الطلبيات</span>
          <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-white">
          {{ ordersCount }}
        </div>
        <span class="text-xs text-zinc-400 block">
          {{ b2bOrdersCount }} طلبية مؤسسات وشركات B2B
        </span>
      </div>

      <!-- Average Basket -->
      <div class="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400">متوسط سلة الشراء</span>
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <CreditCard class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-amber-400">
          {{ formatPrice(avgBasket) }} <span class="text-sm font-sans font-bold text-zinc-400">دج</span>
        </div>
        <span class="text-xs text-zinc-400 block">
          معدل قيمة الكعكة أو الطلب
        </span>
      </div>

      <!-- Inventory Value -->
      <div class="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400">قيمة المواد الأولية بالمخزن</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Layers class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-emerald-400">
          {{ formatPrice(store.totalInventoryValueDZD) }} <span class="text-sm font-sans font-bold text-zinc-400">دج</span>
        </div>
        <span class="text-xs text-zinc-400 block">
          مخزون اللوز، العسل والشوكولاتة
        </span>
      </div>
    </div>

    <!-- Analytics Insights: Wilayas Distribution & Customer Retention -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Wilayas Breakdown -->
      <div class="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <MapPin class="w-5 h-5 text-pink-500" />
          <span>توزيع الطلبيات وقيمتها حسب الولايات</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="wilaya in wilayasBreakdown"
            :key="wilaya.code"
            class="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
          >
            <div>
              <div class="font-bold text-white flex items-center gap-2">
                <span>{{ wilaya.name }} (ولاية {{ wilaya.code.toString().padStart(2, '0') }})</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {{ wilaya.count }} طلبيات
                </span>
              </div>
            </div>

            <div class="font-mono font-bold text-pink-400">
              {{ formatPrice(wilaya.totalDZD) }} دج
            </div>
          </div>
        </div>
      </div>

      <!-- Workshop Operational Tips & Customer Loyalty -->
      <div class="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Award class="w-5 h-5 text-amber-400" />
          <span>مؤشرات ولاء الزبائن وتوصيات الورشة</span>
        </h3>

        <div class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div>
              <span class="text-zinc-500 block">نسبة الزبائن المتكررين</span>
              <span class="text-xl font-bold text-white mt-1 block">{{ repeatRate }}%</span>
              <span class="text-[10px] text-zinc-400">أكثر من طلبية واحدة</span>
            </div>
            <div>
              <span class="text-zinc-500 block">كبار العملاء المعتمدين VIP</span>
              <span class="text-xl font-bold text-amber-400 mt-1 block">{{ vipCount }}</span>
              <span class="text-[10px] text-zinc-400">أكثر من 20,000 دج</span>
            </div>
          </div>

          <div class="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl text-zinc-200 leading-relaxed space-y-1">
            <span class="font-bold text-pink-400 block text-xs">نصيحة المنصة لتطوير الورشة:</span>
            <p class="text-xs text-zinc-300 font-light">
              احرص على توثيق مرحلة التزيين النهائي وإرفاق صورة الإثبات الحقيقية من داخل الورشة لكل طلبية؛ هذا يرفع رضا وثقة الزبائن في الجزائر بنسبة تفوق 45% ويشجعهم على معاودة الطلب في مناسباتهم القادمة.
            </p>
          </div>

          <div class="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <span class="font-bold text-zinc-300 block">أداء التوصيل والشحن:</span>
            <div class="flex items-center justify-between text-zinc-400">
              <span>نسبة التسليم الناجح</span>
              <span class="font-bold text-emerald-400">98.5%</span>
            </div>
            <div class="w-full bg-zinc-800 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full w-[98.5%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Layers,
  MapPin,
  Award
} from 'lucide-vue-next';

const store = useOrderStore();

const totalRevenue = computed(() => store.totalRevenueDZD);
const ordersCount = computed(() => store.orders.length);
const b2bOrdersCount = computed(() => store.orders.filter((o) => o.isB2B).length);
const avgBasket = computed(() => {
  return ordersCount.value > 0 ? Math.round(totalRevenue.value / ordersCount.value) : 0;
});

const wilayasBreakdown = computed(() => {
  const map = new Map<number, { code: number; name: string; count: number; totalDZD: number }>();
  store.orders.forEach((o) => {
    const code = o.deliveryWilayaCode || 16;
    const name = o.deliveryWilayaName || 'الجزائر العاصمة';
    if (!map.has(code)) {
      map.set(code, { code, name, count: 0, totalDZD: 0 });
    }
    const item = map.get(code)!;
    item.count += 1;
    item.totalDZD += o.totalPriceDZD || 0;
  });
  return Array.from(map.values()).sort((a, b) => b.totalDZD - a.totalDZD);
});

const vipCount = computed(() => {
  return store.customers.filter((c) => c.isVIP).length;
});

const repeatRate = computed(() => {
  if (store.customers.length === 0) return 0;
  const repeat = store.customers.filter((c) => c.totalOrders > 1).length;
  return Math.round((repeat / store.customers.length) * 100);
});

function formatPrice(val: number): string {
  return (val || 0).toLocaleString('fr-DZ');
}
</script>
