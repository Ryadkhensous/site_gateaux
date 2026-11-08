<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { OrderItem } from '../types';
import { formatDZD } from '../utils/format';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Truck,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-vue-next';

const store = useOrderStore();

const filterTimeframe = ref<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
const selectedOrder = ref<OrderItem | null>(null);

// حساب المواعيد والطلبيات مع تحديد درجة الاستعجال
const scheduledOrders = computed(() => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDayMs = 24 * 3600 * 1000;

  return store.orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'DELIVERED')
    .map((order) => {
      const eventTime = new Date(order.eventDate).getTime();
      const diffDays = Math.ceil((eventTime - startOfToday) / oneDayMs);

      let urgency: 'TODAY' | 'URGENT' | 'UPCOMING' | 'LATER' = 'LATER';
      let urgencyLabel = 'لاحقاً';
      let urgencyClass = 'bg-stone-100 text-stone-700 border-stone-200';

      if (diffDays <= 0) {
        urgency = 'TODAY';
        urgencyLabel = 'مستحق اليوم !';
        urgencyClass = 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse';
      } else if (diffDays === 1) {
        urgency = 'URGENT';
        urgencyLabel = 'مستحق غداً !';
        urgencyClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      } else if (diffDays <= 7) {
        urgency = 'UPCOMING';
        urgencyLabel = `خلال ${diffDays} أيام`;
        urgencyClass = 'bg-blue-50 text-blue-800 border-blue-200';
      }

      return {
        ...order,
        diffDays,
        urgency,
        urgencyLabel,
        urgencyClass
      };
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
});

const filteredScheduledOrders = computed(() => {
  if (filterTimeframe.value === 'TODAY') {
    return scheduledOrders.value.filter((o) => o.diffDays <= 0);
  }
  if (filterTimeframe.value === 'WEEK') {
    return scheduledOrders.value.filter((o) => o.diffDays <= 7);
  }
  if (filterTimeframe.value === 'MONTH') {
    return scheduledOrders.value.filter((o) => o.diffDays <= 30);
  }
  return scheduledOrders.value;
});

// مؤشرات جدول العمل
const todayCount = computed(() => scheduledOrders.value.filter((o) => o.diffDays <= 0).length);
const tomorrowCount = computed(() => scheduledOrders.value.filter((o) => o.diffDays === 1).length);
const thisWeekCount = computed(() => scheduledOrders.value.filter((o) => o.diffDays <= 7).length);

// مؤشر الطاقة الاستيعابية اليومية للورشة
const dailyCapacity = computed(() => store.settings?.dailyCapacity || 5);
const capacityPercentage = computed(() => {
  return Math.min(100, Math.round((todayCount.value / dailyCapacity.value) * 100));
});

const printSlip = (order: OrderItem) => {
  selectedOrder.value = order;
  setTimeout(() => {
    window.print();
  }, 150);
};
</script>

<template>
  <div class="space-y-6 text-right">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-stone-900">
          جدول التسليم ومواعيد الورشة
        </h1>
        <p class="text-xs text-stone-500 mt-0.5 font-light">
          تنظيم وتتبع مواعيد خبز وتزيين وتسليم الكعكات حسب تواريخ مناسبات الزبائن.
        </p>
      </div>

      <!-- فلاتر المدى الزمني -->
      <div class="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs self-start sm:self-auto">
        <button
          @click="filterTimeframe = 'ALL'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
            filterTimeframe === 'ALL' ? 'bg-[#E84375] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
          ]"
        >
          الكل ({{ scheduledOrders.length }})
        </button>
        <button
          @click="filterTimeframe = 'TODAY'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
            filterTimeframe === 'TODAY' ? 'bg-[#E84375] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
          ]"
        >
          اليوم ({{ todayCount }})
        </button>
        <button
          @click="filterTimeframe = 'WEEK'"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
            filterTimeframe === 'WEEK' ? 'bg-[#E84375] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
          ]"
        >
          هذا الأسبوع ({{ thisWeekCount }})
        </button>
      </div>
    </div>

    <!-- بطاقات الإحصاءات والاستيعاب اليومي -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold mb-1">
          <span>طلبيات اليوم</span>
          <AlertCircle v-if="todayCount > 0" class="w-4 h-4 text-rose-500 animate-pulse" />
          <CalendarIcon v-else class="w-4 h-4 text-stone-400" />
        </div>
        <div class="text-2xl font-bold font-mono text-stone-900">
          {{ todayCount }}
        </div>
        <span class="text-[10px] text-rose-600 font-semibold mt-1 block">
          يجب إنهاؤها وتسليمها اليوم
        </span>
      </div>

      <div class="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold mb-1">
          <span>طلبيات الغد</span>
          <Clock class="w-4 h-4 text-amber-500" />
        </div>
        <div class="text-2xl font-bold font-mono text-stone-900">
          {{ tomorrowCount }}
        </div>
        <span class="text-[10px] text-stone-500 font-light mt-1 block">
          مرحلة المونتاج والتزيين
        </span>
      </div>

      <div class="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold mb-1">
          <span>هذا الأسبوع</span>
          <CalendarIcon class="w-4 h-4 text-blue-500" />
        </div>
        <div class="text-2xl font-bold font-mono text-stone-900">
          {{ thisWeekCount }}
        </div>
        <span class="text-[10px] text-stone-500 font-light mt-1 block">
          ضمن خطة الإنتاج الأسبوعية
        </span>
      </div>

      <!-- مقياس الضغط والطاقة الاستيعابية اليومية -->
      <div class="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
        <div class="flex items-center justify-between text-xs text-stone-500 font-bold mb-1">
          <span>الطاقة الاستيعابية لليوم</span>
          <span class="text-[11px] font-mono font-bold text-[#E84375]">
            {{ todayCount }} / {{ dailyCapacity }}
          </span>
        </div>
        <div class="w-full bg-stone-100 rounded-full h-2.5 my-2 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="capacityPercentage >= 90 ? 'bg-rose-500' : capacityPercentage >= 60 ? 'bg-amber-500' : 'bg-emerald-500'"
            :style="{ width: `${capacityPercentage}%` }"
          ></div>
        </div>
        <span class="text-[10px] text-stone-400 font-light block">
          الحد الأقصى: {{ dailyCapacity }} كعكات يومياً
        </span>
      </div>
    </div>

    <!-- قائمة مواعيد التسليم المرتبة زمنياً -->
    <div class="space-y-4">
      <div v-if="filteredScheduledOrders.length === 0" class="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
        <CalendarIcon class="w-12 h-12 text-stone-300 mx-auto" />
        <h3 class="font-bold text-stone-800 text-sm">لا توجد طلبيات مجدولة في هذا المدى الزمني</h3>
        <p class="text-xs text-stone-400 font-light">
          يمكنك تغيير الفلتر لعرض كامل طلبيات الورشة المسجلة.
        </p>
      </div>

      <div
        v-for="order in filteredScheduledOrders"
        :key="order.id"
        class="bg-white rounded-2xl border border-stone-200 hover:border-pink-300 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
      >
        <!-- الجانب الأيمن: تاريخ المناسبة ودرجة الاستعجال -->
        <div class="flex items-start gap-4">
          <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-50 border border-stone-200 min-w-[70px] text-center">
            <span class="text-[10px] font-bold text-stone-400 uppercase">
              {{ new Date(order.eventDate).toLocaleDateString('ar-DZ', { month: 'short' }) }}
            </span>
            <span class="text-2xl font-bold font-mono text-stone-900 leading-none my-1">
              {{ new Date(order.eventDate).getDate() }}
            </span>
            <span class="text-[10px] text-stone-500 font-medium">
              {{ new Date(order.eventDate).toLocaleDateString('ar-DZ', { weekday: 'short' }) }}
            </span>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono font-bold text-stone-900">
                #{{ order.orderNumber }}
              </span>
              <span :class="['px-2.5 py-0.5 rounded-full text-[10px] border', order.urgencyClass]">
                {{ order.urgencyLabel }}
              </span>
              <span v-if="order.isB2B" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                مؤسسة B2B
              </span>
            </div>

            <h3 class="text-base font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
              {{ order.productName || (order.customization?.sizeName ? `كعكة مخصصة (${order.customization.sizeName})` : 'كعكة مناسبات خاصة') }}
            </h3>

            <div class="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-light pt-0.5">
              <span class="flex items-center gap-1 font-medium text-stone-800">
                <User class="w-3.5 h-3.5 text-stone-400" />
                {{ order.customerName }}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-[#E84375]" />
                {{ order.deliveryWilayaName }} (ولاية {{ order.deliveryWilayaCode }})
              </span>
              <span v-if="order.customerPhone">•</span>
              <span v-if="order.customerPhone" class="font-mono text-stone-600" dir="ltr">
                {{ order.customerPhone }}
              </span>
            </div>

            <!-- تفاصيل مخصصة للكعكة إن وجدت -->
            <div v-if="order.customization" class="flex flex-wrap gap-1.5 pt-1.5">
              <span v-if="order.customization.flavorName" class="text-[10px] px-2 py-0.5 bg-stone-50 rounded-md text-stone-700 border border-stone-200">
                النكهة: {{ order.customization.flavorName }}
              </span>
              <span v-if="order.customization.messageOnCake" class="text-[10px] px-2 py-0.5 bg-pink-50 rounded-md text-[#E84375] border border-pink-100 font-serif">
                النص: &quot;{{ order.customization.messageOnCake }}&quot;
              </span>
            </div>
          </div>
        </div>

        <!-- الجانب الأيسر: المرحلة الحالية وأزرار الإجراء السريع -->
        <div class="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
          <div class="text-right sm:text-left lg:text-right">
            <span class="text-[10px] text-stone-400 font-bold block mb-0.5">القيمة الإجمالية</span>
            <div class="inline-flex items-baseline gap-1" dir="rtl">
              <span dir="ltr" className="font-mono font-bold text-lg text-stone-900">
                {{ formatDZD(order.totalPriceDZD) }}
              </span>
              <span class="text-xs font-bold text-[#E84375]">دج</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="printSlip(order)"
              title="طباعة تذكرة الورشة"
              class="p-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Printer class="w-4 h-4" />
            </button>
            <a
              v-if="order.customerPhone"
              :href="`https://wa.me/213${order.customerPhone.replace(/[^0-9]/g, '').slice(-9)}?text=${encodeURIComponent(`السلام عليكم ${order.customerName}، معكم شاف ${store.currentArtisan?.storeNameAr || 'SweetBox DZ'}. بخصوص طلبيتكم رقم ${order.orderNumber}...`)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <span>واتساب الزبون</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

