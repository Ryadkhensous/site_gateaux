<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 class="w-7 h-7 text-pink-600" />
          الأداء المالي والإحصائيات التحليلية
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          متابعة رقم الأعمال بالدينار الجزائري (دج)، وتوزيع الطلبيات حسب الولايات وحجم معاملات الأفراد والشركات B2C / B2B
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <TrendingUp class="w-4 h-4 text-emerald-600" />
          <span>تحديث الحسابات الفوري بالدينار (DZD)</span>
        </span>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Revenue -->
      <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">إجمالي المداخيل</span>
          <div class="w-9 h-9 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center font-bold text-xs font-mono">
            دج
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-slate-900">
          {{ formatPrice(totalRevenue) }} <span class="text-sm font-sans font-bold text-pink-600">دج</span>
        </div>
        <span class="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <TrendingUp class="w-3.5 h-3.5" />
          طلبيات مؤكدة وقيد التصنيع بالورشة
        </span>
      </div>

      <!-- Orders Count -->
      <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">إجمالي الطلبيات</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-slate-900">
          {{ ordersCount }}
        </div>
        <span class="text-xs text-slate-500 block">
          {{ b2bOrdersCount }} طلبية مؤسسات وشركات B2B
        </span>
      </div>

      <!-- Average Basket -->
      <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">متوسط سلة الشراء</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <CreditCard class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-amber-700">
          {{ formatPrice(avgBasket) }} <span class="text-sm font-sans font-bold text-slate-500">دج</span>
        </div>
        <span class="text-xs text-slate-400 block">
          معدل قيمة الكعكة أو الطلب
        </span>
      </div>

      <!-- Inventory Value -->
      <div class="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">قيمة المواد الأولية بالمخزن</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Layers class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-black text-2xl text-emerald-700">
          {{ formatPrice(store.totalInventoryValueDZD) }} <span class="text-sm font-sans font-bold text-slate-500">دج</span>
        </div>
        <span class="text-xs text-slate-400 block">
          مخزون اللوز، العسل والشوكولاتة
        </span>
      </div>
    </div>

    <!-- Analytics Insights: Wilayas Distribution & Customer Retention -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Wilayas Breakdown -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin class="w-5 h-5 text-pink-600" />
          <span>توزيع الطلبيات وقيمتها حسب الولايات</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="wilaya in wilayasBreakdown"
            :key="wilaya.code"
            class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
          >
            <div>
              <div class="font-bold text-slate-900 flex items-center gap-2">
                <span>{{ wilaya.name }} (ولاية {{ wilaya.code.toString().padStart(2, '0') }})</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {{ wilaya.count }} طلبيات
                </span>
              </div>
            </div>

            <div class="font-mono font-bold text-pink-600">
              {{ formatPrice(wilaya.totalDZD) }} دج
            </div>
          </div>
        </div>
      </div>

      <!-- Workshop Operational Tips & Customer Loyalty -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award class="w-5 h-5 text-amber-600" />
          <span>مؤشرات ولاء الزبائن وتوصيات الورشة</span>
        </h3>

        <div class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span class="text-slate-500 block">نسبة الزبائن المتكررين</span>
              <span class="text-xl font-bold text-slate-900 mt-1 block">{{ repeatRate }}%</span>
              <span class="text-[10px] text-slate-400">أكثر من طلبية واحدة</span>
            </div>
            <div>
              <span class="text-slate-500 block">كبار العملاء المعتمدين VIP</span>
              <span class="text-xl font-bold text-amber-700 mt-1 block">{{ vipCount }}</span>
              <span class="text-[10px] text-slate-400">أكثر من 20,000 دج</span>
            </div>
          </div>

          <div class="p-4 bg-pink-50 border border-pink-200 rounded-xl text-slate-800 leading-relaxed space-y-1">
            <span class="font-bold text-pink-700 block text-xs">نصيحة المنصة لتطوير الورشة:</span>
            <p class="text-xs text-slate-600 font-light">
              احرص على توثيق مرحلة التزيين النهائي وإرفاق صورة الإثبات الحقيقية من داخل الورشة لكل طلبية؛ هذا يرفع رضا وثقة الزبائن في الجزائر بنسبة تفوق 45% ويشجعهم على معاودة الطلب في مناسباتهم القادمة.
            </p>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span class="font-bold text-slate-800 block">أداء التوصيل والشحن:</span>
            <div class="flex items-center justify-between text-slate-600">
              <span>نسبة التسليم الناجح</span>
              <span class="font-bold text-emerald-700">98.5%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div class="bg-emerald-600 h-2 rounded-full w-[98.5%]"></div>
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
