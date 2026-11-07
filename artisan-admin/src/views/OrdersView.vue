<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { OrderItem } from '../types';
import { formatDZD } from '../utils/format';
import {
  Clock,
  CheckCircle2,
  Camera,
  MapPin,
  User,
  Sparkles,
  Send,
  Calendar,
  CreditCard,
  FileText,
  UploadCloud,
  Trash2
} from 'lucide-vue-next';

const store = useOrderStore();

const selectedOrder = ref<OrderItem | null>(null);
const nextStepId = ref<number>(2);
const photoProofInput = ref<string>('');
const noteInput = ref<string>('');
const isUpdating = ref(false);
const updateSuccessMessage = ref('');
const proofFileInputRef = ref<HTMLInputElement | null>(null);
const isUploadingProof = ref(false);

const triggerProofFileInput = () => {
  proofFileInputRef.value?.click();
};

const handleProofFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploadingProof.value = true;
  const reader = new FileReader();
  reader.onload = (e) => {
    photoProofInput.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  const res = await store.uploadImage(file);
  if (res.success && res.url) {
    photoProofInput.value = res.url;
  }
  isUploadingProof.value = false;
};

const ordersList = computed(() => store.orders);

const openOrderDetails = (order: OrderItem) => {
  selectedOrder.value = order;
  const completedCount = order.trackingSteps.filter((s) => s.completed).length;
  nextStepId.value = Math.min(completedCount + 1, 7);
  photoProofInput.value = '';
  noteInput.value = '';
  updateSuccessMessage.value = '';
};

const submitStepUpdate = async () => {
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
    updateSuccessMessage.value = 'تم توثيق المرحلة وإشعار الزبون بها في الوقت الفعلي !';
    const updated = store.orders.find((o) => o.id === selectedOrder.value?.id);
    if (updated) {
      selectedOrder.value = updated;
    }
    setTimeout(() => {
      updateSuccessMessage.value = '';
    }, 4000);
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'مؤكدة في الورشة', class: 'bg-dore-50 text-dore-800 border border-dore-200' };
    case 'PREPARING_BASE':
      return { label: 'المكونات والجينواز', class: 'bg-beige-100 text-stone-800 border border-beige-300' };
    case 'BAKING_ASSEMBLY':
      return { label: 'الحشو وتركيب الطبقات', class: 'bg-rose-50 text-rose-800 border border-rose-200' };
    case 'DECORATING':
      return { label: 'التغليف والتزيين الفني', class: 'bg-rose-100 text-rose-800 border border-rose-300' };
    case 'READY':
      return { label: 'جاهزة ومغلفة', class: 'bg-emerald-50 text-emerald-800 border border-emerald-200' };
    case 'DELIVERING':
      return { label: 'قيد الشحن المبرد', class: 'bg-dore-100 text-dore-900 border border-dore-300' };
    case 'DELIVERED':
      return { label: 'تم التسليم بنجاح', class: 'bg-stone-100 text-stone-700 border border-stone-200' };
    default:
      return { label: status, class: 'bg-stone-100 text-stone-700' };
  }
};
</script>

<template>
  <div class="space-y-6 text-right">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-stone-900">
          سجل الطلبيات ومتابعة التصنيع المباشر
        </h1>
        <p class="text-xs text-stone-500 mt-0.5">
          تحكّم في تقدم مراحل الصنع في ورشتك وشارك زبائنك صور الإثبات الحية في الوقت الفعلي.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>تزامن مباشر مع تطبيق الزبائن</span>
        </span>
      </div>
    </div>

    <!-- شبكة المحتوى : قائمة الطلبيات + لوحة التحكم في المرحلة -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- قائمة الطلبيات الواردة (7 أعمدة) -->
      <div class="lg:col-span-7 space-y-4">
        <div v-if="ordersList.length === 0" class="p-8 bg-white rounded-3xl border border-beige-200 text-center text-xs text-stone-500">
          لا توجد طلبيات حالياً لهذه الورشة.
        </div>

        <div
          v-for="order in ordersList"
          :key="order.id"
          @click="openOrderDetails(order)"
          :class="[
            'p-5 bg-white rounded-3xl border-2 transition-all cursor-pointer shadow-xs hover:shadow-md',
            selectedOrder?.id === order.id ? 'border-rose-400 bg-rose-50/20' : 'border-beige-200 hover:border-beige-300'
          ]"
        >
          <div class="flex items-center justify-between pb-3 border-b border-beige-100">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-sm text-stone-900">{{ order.orderNumber }}</span>
              <span
                :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold', getStatusBadge(order.status).class]"
              >
                {{ getStatusBadge(order.status).label }}
              </span>
            </div>
            <span class="inline-flex items-baseline gap-1" dir="rtl">
              <span dir="ltr" class="text-base font-mono font-bold text-dore-800">{{ formatDZD(order.totalPriceDZD) }}</span>
              <span class="text-xs font-sans text-dore-700 font-bold">دج</span>
            </span>
          </div>

          <div class="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span class="text-[10px] text-stone-400 font-bold block">الزبون</span>
              <span class="font-semibold text-stone-800">{{ order.customerName }}</span>
              <span class="text-[11px] text-stone-500 block font-mono text-left">{{ order.customerPhone }}</span>
            </div>

            <div>
              <span class="text-[10px] text-stone-400 font-bold block">الوجهة والولاية</span>
              <span class="font-semibold text-stone-800">{{ order.deliveryWilayaName }}</span>
              <span class="text-[11px] text-stone-500 line-clamp-1 font-light">{{ order.deliveryAddress }}</span>
            </div>

            <div>
              <span class="text-[10px] text-stone-400 font-bold block">تاريخ المناسبة</span>
              <span class="font-semibold text-stone-800 font-mono">
                {{ new Date(order.eventDate).toLocaleDateString('ar-DZ') }}
              </span>
              <span class="text-[10px] text-rose-600 block">
                {{ order.paymentMethod === 'CASH_ON_DELIVERY' ? 'الدفع نقداً عند الاستلام' : 'بطاقة بنكية' }}
              </span>
            </div>
          </div>

          <!-- شريط تقدم المراحل السريع -->
          <div class="mt-4 pt-3 border-t border-beige-100 flex items-center justify-between text-[11px]">
            <span class="text-stone-500">
              التقدم: {{ order.trackingSteps.filter((s) => s.completed).length }} من أصل 7 مراحل
            </span>
            <div class="flex gap-1">
              <div
                v-for="step in order.trackingSteps"
                :key="step.stepId"
                :class="[
                  'w-3.5 h-1.5 rounded-full',
                  step.completed ? 'bg-rose-500' : 'bg-beige-200'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- تفاصيل الطلبية وتحديث المراحل (5 أعمدة) -->
      <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-beige-200 shadow-md sticky top-6 space-y-6">
        <div v-if="!selectedOrder" class="py-12 text-center text-xs text-stone-400">
          اختر طلبية من القائمة للاطلاع على تفاصيلها وتحديث خطوات التصنيع.
        </div>

        <div v-else class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-beige-200">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-dore-700 block">
                الطلبية المحددة للتحكم
              </span>
              <h3 class="text-xl font-mono font-bold text-stone-900">{{ selectedOrder.orderNumber }}</h3>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-bold', getStatusBadge(selectedOrder.status).class]">
              {{ getStatusBadge(selectedOrder.status).label }}
            </span>
          </div>

          <!-- بطاقة المواصفات المطلوبة للكعكة -->
          <div class="p-4 bg-beige-50 rounded-2xl border border-beige-200 space-y-2 text-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-dore-800 block">
              مواصفات الكعكة المطلوبة
            </span>
            <div class="font-semibold text-stone-800">
              {{ selectedOrder.customization?.sizeName || selectedOrder.productName || 'كعكة مخصصة' }}
            </div>
            <div v-if="selectedOrder.customization?.flavorName" class="text-stone-600">
              الجينواز: {{ selectedOrder.customization.flavorName }}
            </div>
            <div v-if="selectedOrder.customization?.fillingName" class="text-stone-600">
              الحشوة: {{ selectedOrder.customization.fillingName }}
            </div>
            <div v-if="selectedOrder.customization?.messageOnCake" class="text-rose-700 italic font-serif mt-1">
              "{{ selectedOrder.customization.messageOnCake }}"
            </div>
            <div v-if="selectedOrder.notes" class="text-stone-500 font-light mt-1">
              ملاحظات الزبون: {{ selectedOrder.notes }}
            </div>
          </div>

          <!-- استمارة تحديث وتوثيق مرحلة التصنيع -->
          <div class="space-y-4 pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Camera class="w-4 h-4 text-rose-500" />
              <span>توثيق وتأكيد مرحلة جديدة بالورشة</span>
            </h4>

            <div v-if="updateSuccessMessage" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold text-center">
              {{ updateSuccessMessage }}
            </div>

            <!-- اختيار المرحلة المطلوب اعتمادها -->
            <div>
              <label class="text-[11px] font-bold text-stone-600 block mb-1">المرحلة المراد اعتمادها :</label>
              <select
                v-model="nextStepId"
                class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option
                  v-for="step in selectedOrder.trackingSteps"
                  :key="step.stepId"
                  :value="step.stepId"
                >
                  المرحلة {{ step.stepId }} : {{ step.titleAr || step.title }} {{ step.completed ? '(مكتملة)' : '' }}
                </option>
              </select>
            </div>

            <!-- صورة إثبات العمل في الورشة مع زر الرفع من الحاسوب -->
            <div>
              <label class="text-[11px] font-bold text-stone-700 block mb-1">
                صورة الإثبات من الورشة :
              </label>

              <input
                type="file"
                ref="proofFileInputRef"
                accept="image/*"
                @change="handleProofFileChange"
                class="hidden"
              />

              <!-- إذا تم تحديد أو رفع صورة إثبات -->
              <div v-if="photoProofInput" class="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 overflow-hidden">
                  <img :src="photoProofInput" alt="معاينة الإثبات" class="w-12 h-12 rounded-lg object-cover border border-rose-300 flex-shrink-0 bg-white" />
                  <span class="text-xs text-stone-800 font-bold truncate">تم تحديد صورة الإثبات بنجاح</span>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" @click="triggerProofFileInput" class="px-2 py-1 bg-white text-stone-700 text-[10px] font-bold rounded border border-beige-300">
                    تغيير
                  </button>
                  <button type="button" @click="photoProofInput = ''" class="p-1 text-rose-600 hover:bg-rose-100 rounded">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- زر تصفح الملفات من الجهاز -->
              <div v-else class="space-y-1.5">
                <button
                  type="button"
                  @click="triggerProofFileInput"
                  class="w-full py-2.5 px-3 bg-white hover:bg-rose-50 border border-dashed border-rose-300 hover:border-rose-400 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-rose-700 transition-colors shadow-2xs"
                >
                  <UploadCloud class="w-4 h-4 text-rose-500" />
                  <span>تصفح ورفع صورة الإثبات من جهازك</span>
                </button>
                <input
                  type="text"
                  v-model="photoProofInput"
                  placeholder="أو اكتب مساراً يدوياً (مثال: /images/hero_wedding_cake.jpg)"
                  class="w-full p-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-left"
                />
              </div>
            </div>

            <!-- ملاحظة الحرفي للزبون -->
            <div>
              <label class="text-[11px] font-bold text-stone-600 block mb-1">رسالة أو ملاحظة الحرفي للزبون :</label>
              <textarea
                rows="2"
                v-model="noteInput"
                placeholder="مثال: تم تجهيز الطبقات وتطبيق ورق الذهب الخالص بنجاح!"
                class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              ></textarea>
            </div>

            <button
              @click="submitStepUpdate"
              :disabled="isUpdating"
              class="w-full py-3 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send class="w-3.5 h-3.5" />
              <span>{{ isUpdating ? 'جاري التحديث والتزامن...' : 'تأكيد المرحلة وإرسال الإشعار للزبون' }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
