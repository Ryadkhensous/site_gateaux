<script setup lang="ts">
import { computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { ShoppingBag, TrendingUp, Users, MapPin, Building2 } from 'lucide-vue-next';
import { formatDZD } from '../utils/format';

const store = useOrderStore();

const totalRevenue = computed(() => store.totalRevenueDZD);
const ordersCount = computed(() => store.orders.length);
const b2bOrdersCount = computed(() => store.orders.filter((o) => o.isB2B).length);
const avgBasket = computed(() => {
  return ordersCount.value > 0 ? Math.round(totalRevenue.value / ordersCount.value) : 0;
});
</script>

<template>
  <div class="space-y-6 text-right">
    <!-- رأس الصفحة -->
    <div>
      <h1 class="text-2xl font-serif font-bold text-stone-900">
        الأداء المالي والإحصائيات
      </h1>
      <p class="text-xs text-stone-500 mt-0.5">
        متابعة رقم الأعمال بالدينار الجزائري (دج)، وتوزيع الطلبيات حسب الولايات وحجم معاملات الأفراد والشركات B2C / B2B.
      </p>
    </div>

    <!-- بطاقات المؤشرات المالية الرئيسية -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 bg-white rounded-2xl border border-beige-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-400">إجمالي المداخيل</span>
          <span class="w-8 h-8 rounded-lg bg-dore-50 text-dore-800 border border-dore-200 flex items-center justify-center font-bold text-xs font-mono">
            دج
          </span>
        </div>
        <div class="font-mono font-extrabold text-2xl text-stone-900 inline-flex items-baseline gap-1" dir="rtl">
          <span dir="ltr">{{ formatDZD(totalRevenue) }}</span>
          <span class="text-sm font-sans text-dore-700 font-bold">دج</span>
        </div>
        <span class="text-[11px] text-rose-600 font-semibold block">
          ↑ طلبيات مؤكدة وقيد التصنيع
        </span>
      </div>

      <div class="p-5 bg-white rounded-2xl border border-beige-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-400">إجمالي الطلبيات</span>
          <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-extrabold text-2xl text-stone-900">
          {{ ordersCount }}
        </div>
        <span class="text-[11px] text-stone-500 block">
          أفراد ومؤسسات
        </span>
      </div>

      <div class="p-5 bg-white rounded-2xl border border-beige-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-400">متوسط السلة</span>
          <div class="w-8 h-8 rounded-lg bg-beige-100 text-stone-800 border border-beige-300 flex items-center justify-center">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-extrabold text-2xl text-stone-900 inline-flex items-baseline gap-1" dir="rtl">
          <span dir="ltr">{{ formatDZD(avgBasket) }}</span>
          <span class="text-sm font-sans text-dore-700 font-bold">دج</span>
        </div>
        <span class="text-[11px] text-stone-500 block">
          لكل طلبية منجزة
        </span>
      </div>

      <div class="p-5 bg-white rounded-2xl border border-beige-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-400">طلبيات الشركات B2B</span>
          <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
            <Building2 class="w-4 h-4" />
          </div>
        </div>
        <div class="font-mono font-extrabold text-2xl text-stone-900">
          {{ b2bOrdersCount }}
        </div>
        <span class="text-[11px] text-rose-700 font-semibold block">
          فعاليات وندوات رسمية
        </span>
      </div>
    </div>

    <!-- رؤى الولايات والزبائن -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-beige-200 shadow-sm">
        <h3 class="text-base font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-dore-600" />
          <span>توزيع الطلبيات والزبائن حسب الولايات</span>
        </h3>
        <div class="space-y-3">
          <div v-for="ord in store.orders" :key="ord.id" class="flex items-center justify-between text-xs p-2.5 bg-beige-50 rounded-xl border border-beige-100">
            <span class="font-bold text-stone-800">
              ولاية {{ ord.deliveryWilayaCode.toString().padStart(2, '0') }} - {{ ord.deliveryWilayaName }}
            </span>
            <span class="inline-flex items-baseline gap-1" dir="rtl">
              <span dir="ltr" class="font-mono font-bold text-stone-900">{{ formatDZD(ord.totalPriceDZD) }}</span>
              <span class="text-[10px] text-dore-700 font-sans font-bold">دج</span>
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-beige-200 shadow-sm">
        <h3 class="text-base font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Users class="w-4 h-4 text-rose-600" />
          <span>تفاعل الزبائن وتوصيات الشيف</span>
        </h3>
        <div class="space-y-4 text-xs text-stone-600">
          <p class="leading-relaxed font-light">
            يحظى ملف ورشتكم بظهور مباشر لدى آلاف الزبائن الباحثين عن كعكات مخصصة للأعراس والاحتفالات عبر كافة الولايات.
          </p>
          <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 font-medium leading-relaxed">
            نصيحة الشيف : احرص على إرفاق صورة حقيقية من ورشتك عند مرحلة التغليف والتزيين؛ فهذا يرفع رضا وثقة الزبائن بنسبة تفوق 40% ويضمن تكرار الطلبيات !
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
