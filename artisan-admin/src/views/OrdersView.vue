<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <ShoppingBag class="w-7 h-7 text-pink-500" />
          سجل الطلبيات ومتابعة مراحل التصنيع المباشر
        </h1>
        <p class="text-xs text-zinc-400 mt-1">
          إدارة طلبيات الكعكات، تحديث مراحل الصنع بالورشة، طباعة وصولات الإنتاج وتنبيه الزبائن في الوقت الفعلي
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
          <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span>تزامن فوري مع تطبيق الزبائن</span>
        </span>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <Search class="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث برقم الطلب، اسم الزبون، الهاتف أو الولاية..."
          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-11 pl-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      <!-- Status Tabs -->
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          @click="statusFilter = 'ALL'"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            statusFilter === 'ALL'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          الكل ({{ store.orders.length }})
        </button>
        <button
          @click="statusFilter = 'PENDING_CONFIRMED'"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            statusFilter === 'PENDING_CONFIRMED'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          مؤكدة ({{ countPendingConfirmed }})
        </button>
        <button
          @click="statusFilter = 'IN_WORKSHOP'"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            statusFilter === 'IN_WORKSHOP'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          في الورشة ({{ countInWorkshop }})
        </button>
        <button
          @click="statusFilter = 'READY'"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            statusFilter === 'READY'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          جاهزة ومسار التوصيل ({{ countReady }})
        </button>
        <button
          @click="statusFilter = 'DELIVERED'"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            statusFilter === 'DELIVERED'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          مكتملة ({{ countDelivered }})
        </button>
      </div>
    </div>

    <!-- Grid: Orders List + Live Control Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Orders List (7 columns) -->
      <div class="lg:col-span-7 space-y-4">
        <div v-if="filteredOrdersList.length === 0" class="p-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-center text-zinc-500">
          <ShoppingBag class="w-12 h-12 mx-auto text-zinc-600 mb-3" />
          <p class="text-base font-semibold text-zinc-300">لا توجد طلبيات مطابقة للبحث أو الفلتر المختار</p>
          <p class="text-xs text-zinc-500 mt-1">جرب إزالة معايير البحث أو اختيار كل الحالات</p>
        </div>

        <div
          v-for="order in filteredOrdersList"
          :key="order.id"
          @click="openOrderDetails(order)"
          :class="[
            'p-5 bg-zinc-900 rounded-2xl border transition-all cursor-pointer shadow-sm relative',
            selectedOrder?.id === order.id
              ? 'border-pink-500 ring-1 ring-pink-500/50 bg-zinc-900/90'
              : 'border-zinc-800 hover:border-zinc-700'
          ]"
        >
          <!-- Order Card Top Bar -->
          <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-sm text-white">#{{ order.orderNumber }}</span>
              <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold', getStatusBadge(order.status).class]">
                {{ getStatusBadge(order.status).label }}
              </span>
              <span
                v-if="order.isB2B"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                B2B مؤسسات
              </span>
            </div>

            <div class="font-mono font-bold text-pink-400 text-sm">
              {{ formatPrice(order.totalPriceDZD) }} دج
            </div>
          </div>

          <!-- Order Summary Details -->
          <div class="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span class="text-[10px] text-zinc-500 font-bold block mb-0.5">الزبون</span>
              <span class="font-bold text-zinc-200">{{ order.customerName }}</span>
              <span class="text-[11px] text-zinc-400 block font-mono text-left" dir="ltr">{{ order.customerPhone }}</span>
            </div>

            <div>
              <span class="text-[10px] text-zinc-500 font-bold block mb-0.5">الولاية والعنوان</span>
              <span class="font-bold text-zinc-200 flex items-center gap-1">
                <MapPin class="w-3 h-3 text-pink-500" />
                {{ order.deliveryWilayaName }}
              </span>
              <span class="text-[11px] text-zinc-400 truncate block">{{ order.deliveryAddress }}</span>
            </div>

            <div>
              <span class="text-[10px] text-zinc-500 font-bold block mb-0.5">موعد التسليم</span>
              <span class="font-bold text-zinc-200 flex items-center gap-1">
                <Calendar class="w-3 h-3 text-pink-500" />
                {{ formatDate(order.eventDate) }}
              </span>
              <span class="text-[10px] text-zinc-400 block">
                {{ getPaymentLabel(order.paymentMethod) }}
              </span>
            </div>
          </div>

          <!-- Progress Bar & Actions -->
          <div class="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="text-zinc-400 text-[11px]">
                التقدم: {{ getCompletedStepsCount(order) }} من 7 مراحل
              </span>
              <div class="flex gap-1">
                <div
                  v-for="step in order.trackingSteps"
                  :key="step.stepId"
                  :class="[
                    'w-3 h-1.5 rounded-full',
                    step.completed ? 'bg-pink-500' : 'bg-zinc-800'
                  ]"
                ></div>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center gap-2" @click.stop>
              <!-- Print Slip -->
              <button
                @click="printOrderSlip(order)"
                class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="طباعة وصل الورشة"
              >
                <Printer class="w-3.5 h-3.5" />
              </button>

              <!-- WhatsApp Direct -->
              <a
                v-if="order.customerPhone"
                :href="getWhatsAppOrderLink(order)"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                title="مراسلة عبر واتساب"
              >
                <MessageCircle class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details & Step Crafting Panel (5 columns) -->
      <div class="lg:col-span-5 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md sticky top-6 space-y-6">
        <div v-if="!selectedOrder" class="py-16 text-center text-zinc-500 space-y-2">
          <Eye class="w-10 h-10 mx-auto text-zinc-600 mb-2" />
          <p class="text-sm font-semibold text-zinc-300">اختر طلبية من القائمة للتحكم والتحديث</p>
          <p class="text-xs text-zinc-500">يمكنك هنا توثيق خطوات الصنع بالصور وتحديث حالة الطلبية فورياً</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Order Selected Header -->
          <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <span class="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                الطلبية المحددة
              </span>
              <h3 class="text-xl font-mono font-bold text-white">#{{ selectedOrder.orderNumber }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="printOrderSlip(selectedOrder)"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Printer class="w-3.5 h-3.5 text-zinc-400" />
                طباعة الوصل
              </button>
              <span :class="['px-3 py-1 rounded-full text-xs font-bold', getStatusBadge(selectedOrder.status).class]">
                {{ getStatusBadge(selectedOrder.status).label }}
              </span>
            </div>
          </div>

          <!-- Specs Card -->
          <div class="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 text-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              مواصفات الكعكة المطلوبة بالورشة
            </span>
            <div class="font-bold text-white text-sm">
              {{ selectedOrder.customization?.sizeName || selectedOrder.productName || 'كعكة مخصصة' }}
            </div>
            <div v-if="selectedOrder.customization?.flavorName" class="text-zinc-300">
              <span class="text-zinc-500">الجينواز:</span> {{ selectedOrder.customization.flavorName }}
            </div>
            <div v-if="selectedOrder.customization?.fillingName" class="text-zinc-300">
              <span class="text-zinc-500">الحشوة:</span> {{ selectedOrder.customization.fillingName }}
            </div>
            <div v-if="selectedOrder.customization?.messageOnCake" class="text-pink-400 font-medium">
              <span class="text-zinc-500">العبارة المكتوبة:</span> "{{ selectedOrder.customization.messageOnCake }}"
            </div>
            <div v-if="selectedOrder.notes" class="text-amber-400/90 text-xs mt-1 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <span class="font-bold">ملاحظات الزبون:</span> {{ selectedOrder.notes }}
            </div>
          </div>

          <!-- Step Progression Form -->
          <div class="space-y-4 pt-1">
            <h4 class="text-xs font-bold text-white flex items-center gap-2">
              <Camera class="w-4 h-4 text-pink-500" />
              <span>توثيق وتأكيد مرحلة جديدة بالورشة</span>
            </h4>

            <div v-if="updateSuccessMessage" class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold text-center">
              {{ updateSuccessMessage }}
            </div>

            <!-- Choose Step -->
            <div>
              <label class="text-[11px] font-bold text-zinc-400 block mb-1">المرحلة المراد اعتمادها:</label>
              <select
                v-model="nextStepId"
                class="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-pink-500"
              >
                <option
                  v-for="step in selectedOrder.trackingSteps"
                  :key="step.stepId"
                  :value="step.stepId"
                >
                  المرحلة {{ step.stepId }}: {{ step.titleAr || step.title }} {{ step.completed ? '(مكتملة)' : '' }}
                </option>
              </select>
            </div>

            <!-- Photo Proof with Upload -->
            <div>
              <label class="text-[11px] font-bold text-zinc-400 block mb-1">
                صورة الإثبات المباشرة من الورشة:
              </label>

              <input
                type="file"
                ref="proofFileInputRef"
                accept="image/*"
                @change="handleProofFileChange"
                class="hidden"
              />

              <!-- Preview if exists -->
              <div v-if="photoProofInput" class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 overflow-hidden">
                  <img :src="photoProofInput" alt="معاينة الإثبات" class="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0 bg-zinc-900" />
                  <span class="text-xs text-zinc-200 font-bold truncate">تم تحديد صورة الإثبات بنجاح</span>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" @click="triggerProofFileInput" class="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded border border-zinc-700">
                    تغيير
                  </button>
                  <button type="button" @click="photoProofInput = ''" class="p-1 text-red-400 hover:bg-red-500/10 rounded">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Upload trigger -->
              <div v-else class="space-y-1.5">
                <button
                  type="button"
                  @click="triggerProofFileInput"
                  class="w-full py-3 px-3 bg-zinc-950 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-pink-500 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-pink-400 transition-colors"
                >
                  <UploadCloud class="w-4 h-4 text-pink-500" />
                  <span>تصفح ورفع صورة الإثبات من جهازك</span>
                </button>
                <input
                  type="text"
                  v-model="photoProofInput"
                  placeholder="أو اكتب مساراً يدوياً (مثال: /images/hero_wedding_cake.jpg)"
                  class="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-pink-500 text-left"
                />
              </div>
            </div>

            <!-- Chef Note to Customer -->
            <div>
              <label class="text-[11px] font-bold text-zinc-400 block mb-1">رسالة أو ملاحظة الحرفي للزبون:</label>
              <textarea
                rows="2"
                v-model="noteInput"
                placeholder="مثال: تم تجهيز الطبقات وتطبيق ورق الذهب الخالص بنجاح!"
                class="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
              ></textarea>
            </div>

            <button
              @click="submitStepUpdate"
              :disabled="isUpdating"
              class="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send class="w-3.5 h-3.5" />
              <span>{{ isUpdating ? 'جارٍ التحديث والتزامن...' : 'تأكيد المرحلة وإرسال الإشعار للزبون' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Printable Workshop Production Slip Modal (Visible on Print or Screen) -->
    <div
      v-if="printingOrder"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="printingOrder = null"
    >
      <div id="print-section" class="bg-white text-zinc-900 rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl text-right" dir="rtl">
        <div class="flex items-center justify-between border-b pb-4">
          <div class="text-left">
            <span class="text-xs text-zinc-500 block">رقم الطلبية</span>
            <span class="text-xl font-bold font-mono text-zinc-900">#{{ printingOrder.orderNumber }}</span>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-bold text-zinc-900">وصل ورشة العمل والإنتاج</h2>
            <p class="text-xs text-zinc-500">{{ store.settings.storeName }} - SweetBox DZ</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <div>
            <span class="font-bold text-zinc-500 block">الزبون:</span>
            <span class="font-bold text-base text-zinc-900">{{ printingOrder.customerName }}</span>
            <span class="block text-zinc-600 font-mono" dir="ltr">{{ printingOrder.customerPhone }}</span>
          </div>
          <div>
            <span class="font-bold text-zinc-500 block">تاريخ التسليم المطلوب:</span>
            <span class="font-bold text-base text-pink-600">{{ formatDate(printingOrder.eventDate) }}</span>
            <span class="block text-zinc-600">{{ printingOrder.deliveryWilayaName }} - {{ printingOrder.deliveryAddress }}</span>
          </div>
        </div>

        <div class="border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
          <h3 class="font-bold text-sm text-zinc-900 border-b pb-2">مواصفات التصنيع والوصفة:</h3>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <span class="text-zinc-500">نوع الحلوى:</span>
              <span class="font-bold block">{{ printingOrder.productName || 'كعكة مخصصة 3D' }}</span>
            </div>
            <div v-if="printingOrder.customization?.servingsCount">
              <span class="text-zinc-500">عدد الأفراد:</span>
              <span class="font-bold block">{{ printingOrder.customization.servingsCount }} أفراد</span>
            </div>
            <div v-if="printingOrder.customization?.flavorName">
              <span class="text-zinc-500">نكهة الجينواز:</span>
              <span class="font-bold block">{{ printingOrder.customization.flavorName }}</span>
            </div>
            <div v-if="printingOrder.customization?.fillingName">
              <span class="text-zinc-500">الحشوة الداخلية:</span>
              <span class="font-bold block">{{ printingOrder.customization.fillingName }}</span>
            </div>
          </div>

          <div v-if="printingOrder.customization?.messageOnCake" class="pt-2 border-t">
            <span class="text-zinc-500">العبارة المطلوبة على الكعكة:</span>
            <p class="font-bold text-pink-700 text-sm italic mt-0.5">"{{ printingOrder.customization.messageOnCake }}"</p>
          </div>

          <div v-if="printingOrder.notes" class="pt-2 border-t text-amber-800 bg-amber-50 p-2 rounded">
            <span class="font-bold">ملاحظات إضافية من الزبون:</span>
            <p class="mt-0.5">{{ printingOrder.notes }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t text-xs">
          <div>
            <span class="text-zinc-500">المبلغ الإجمالي:</span>
            <span class="font-bold text-base text-zinc-900 mr-2">{{ formatPrice(printingOrder.totalPriceDZD) }} دج</span>
          </div>
          <div>
            <span class="text-zinc-500">طريقة الدفع:</span>
            <span class="font-bold mr-2">{{ getPaymentLabel(printingOrder.paymentMethod) }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t print:hidden">
          <button
            @click="printingOrder = null"
            class="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="triggerBrowserPrint"
            class="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Printer class="w-4 h-4" />
            طباعة الوصل الآن (Ctrl+P)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { OrderItem } from '../types';
import {
  ShoppingBag,
  Search,
  MapPin,
  Calendar,
  Printer,
  MessageCircle,
  Eye,
  Camera,
  UploadCloud,
  Trash2,
  Send
} from 'lucide-vue-next';

const store = useOrderStore();

const searchQuery = ref('');
const statusFilter = ref<'ALL' | 'PENDING_CONFIRMED' | 'IN_WORKSHOP' | 'READY' | 'DELIVERED'>('ALL');
const selectedOrder = ref<OrderItem | null>(null);
const printingOrder = ref<OrderItem | null>(null);

const nextStepId = ref<number>(2);
const photoProofInput = ref<string>('');
const noteInput = ref<string>('');
const isUpdating = ref(false);
const updateSuccessMessage = ref('');
const proofFileInputRef = ref<HTMLInputElement | null>(null);

// Counts
const countPendingConfirmed = computed(() => {
  return store.orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PENDING').length;
});

const countInWorkshop = computed(() => {
  return store.orders.filter((o) =>
    o.status === 'PREPARING_BASE' || o.status === 'BAKING_ASSEMBLY' || o.status === 'DECORATING'
  ).length;
});

const countReady = computed(() => {
  return store.orders.filter((o) => o.status === 'READY' || o.status === 'DELIVERING').length;
});

const countDelivered = computed(() => {
  return store.orders.filter((o) => o.status === 'DELIVERED').length;
});

const filteredOrdersList = computed(() => {
  return store.orders.filter((order) => {
    // Search
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      (order.deliveryWilayaName && order.deliveryWilayaName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Filter status
    if (statusFilter.value === 'PENDING_CONFIRMED') {
      return order.status === 'CONFIRMED' || order.status === 'PENDING';
    }
    if (statusFilter.value === 'IN_WORKSHOP') {
      return (
        order.status === 'PREPARING_BASE' ||
        order.status === 'BAKING_ASSEMBLY' ||
        order.status === 'DECORATING'
      );
    }
    if (statusFilter.value === 'READY') {
      return order.status === 'READY' || order.status === 'DELIVERING';
    }
    if (statusFilter.value === 'DELIVERED') {
      return order.status === 'DELIVERED';
    }
    return true;
  });
});

function openOrderDetails(order: OrderItem) {
  selectedOrder.value = order;
  const completedCount = order.trackingSteps.filter((s) => s.completed).length;
  nextStepId.value = Math.min(completedCount + 1, 7);
  photoProofInput.value = '';
  noteInput.value = '';
  updateSuccessMessage.value = '';
}

function getCompletedStepsCount(order: OrderItem): number {
  return order.trackingSteps.filter((s) => s.completed).length;
}

function triggerProofFileInput() {
  proofFileInputRef.value?.click();
}

async function handleProofFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    photoProofInput.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  const res = await store.uploadImage(file);
  if (res.success && res.url) {
    photoProofInput.value = res.url;
  }
}

async function submitStepUpdate() {
  if (!selectedOrder.value) return;
  isUpdating.value = true;
  updateSuccessMessage.value = '';

  const stepObj = selectedOrder.value.trackingSteps.find((s) => s.stepId === nextStepId.value);
  const newStatus = stepObj ? stepObj.status : selectedOrder.value.status;

  const res = await store.updateOrderStep(
    selectedOrder.value.id,
    nextStepId.value,
    newStatus,
    photoProofInput.value.trim() || undefined,
    noteInput.value.trim() || undefined
  );

  isUpdating.value = false;

  if (res.success) {
    updateSuccessMessage.value = 'تم توثيق المرحلة وإشعار الزبون بها في الوقت الفعلي!';
    const updated = store.orders.find((o) => o.id === selectedOrder.value?.id);
    if (updated) {
      selectedOrder.value = updated;
    }
    setTimeout(() => {
      updateSuccessMessage.value = '';
    }, 4000);
  }
}

function printOrderSlip(order: OrderItem) {
  printingOrder.value = order;
}

function triggerBrowserPrint() {
  window.print();
}

function cleanPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

function getWhatsAppOrderLink(order: OrderItem): string {
  let p = cleanPhone(order.customerPhone);
  if (p.startsWith('0')) {
    p = '213' + p.substring(1);
  } else if (!p.startsWith('213') && !p.startsWith('+213')) {
    p = '213' + p;
  }
  p = p.replace('+', '');
  const statusLabel = getStatusBadge(order.status).label;
  const msg = encodeURIComponent(
    `السلام عليكم ${order.customerName}، نتواصل معك من ورشة ${store.settings.storeName} بخصوص طلبيتك #${order.orderNumber}. حالتها الحالية: ${statusLabel}. شكراً لاختيارك منصة SweetBox DZ!`
  );
  return `https://wa.me/${p}?text=${msg}`;
}

function formatPrice(val: number): string {
  return (val || 0).toLocaleString('fr-DZ');
}

function formatDate(dStr: string): string {
  if (!dStr) return '-';
  try {
    const d = new Date(dStr);
    return d.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dStr;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'مؤكدة بالورشة', class: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
    case 'PREPARING_BASE':
      return { label: 'المكونات والجينواز', class: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    case 'BAKING_ASSEMBLY':
      return { label: 'الحشو وتركيب الطبقات', class: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    case 'DECORATING':
      return { label: 'التغليف والتزيين الفني', class: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' };
    case 'READY':
      return { label: 'جاهزة ومغلفة', class: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    case 'DELIVERING':
      return { label: 'قيد الشحن المبرد', class: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' };
    case 'DELIVERED':
      return { label: 'تم التسليم بنجاح', class: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' };
    case 'CANCELLED':
      return { label: 'ملغاة', class: 'bg-red-500/10 text-red-400 border border-red-500/20' };
    default:
      return { label: status, class: 'bg-zinc-800 text-zinc-300' };
  }
}

function getPaymentLabel(method: string): string {
  const map: Record<string, string> = {
    CASH_ON_DELIVERY: 'الدفع نقداً عند الاستلام',
    CIB_EDAHABIA: 'بريدي موب / CIB',
    BANK_TRANSFER: 'تحويل بنكي'
  };
  return map[method] || method;
}
</script>
