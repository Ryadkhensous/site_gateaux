<template>
  <div class="space-y-6 text-right max-w-5xl mx-auto" dir="rtl">
    <!-- Header -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <Settings class="w-7 h-7 text-pink-500" />
          إعدادات الورشة والحساب
        </h1>
        <p class="text-zinc-400 text-sm mt-1">
          تخصيص هوية ورشة الحلويات، معلومات التواصل، الطاقة الاستيعابية اليومية وطرق الدفع
        </p>
      </div>

      <button
        @click="saveAllSettings"
        :disabled="isSaving"
        class="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-600/25 transition-all disabled:opacity-50"
      >
        <Check v-if="!isSaving" class="w-4 h-4" />
        <Loader2 v-else class="w-4 h-4 animate-spin" />
        {{ isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات' }}
      </button>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="toastMessage"
      class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-400 hover:text-white">
        <X class="w-4 h-4" />
      </button>
    </div>

    <form @submit.prevent="saveAllSettings" class="space-y-6">
      <!-- Section 1: Workshop Profile -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Store class="w-5 h-5 text-pink-500" />
          بيانات الورشة والهوية التجارية
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">اسم المتجر / الورشة</label>
            <input
              v-model="form.storeName"
              type="text"
              required
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="مثال: حلويات العاصمة الفاخرة"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">اسم الحرفي(ة) أو الشيف المسؤول</label>
            <input
              v-model="form.chefName"
              type="text"
              required
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="مثال: ياسمين بن علي"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">رقم الهاتف للاتصال المباشر</label>
            <input
              v-model="form.phone"
              type="text"
              required
              dir="ltr"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 text-right focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="0550 12 34 56"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">رقم واتساب المعتمد (مع الرمز الدولي 213)</label>
            <input
              v-model="form.whatsappNumber"
              type="text"
              dir="ltr"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 text-right focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="213550123456"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">الولاية</label>
            <select
              v-model.number="form.wilayaCode"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 transition-colors"
            >
              <option :value="16">16 - الجزائر العاصمة</option>
              <option :value="31">31 - وهران</option>
              <option :value="25">25 - قسنطينة</option>
              <option :value="9">09 - البليدة</option>
              <option :value="6">06 - بجاية</option>
              <option :value="15">15 - تيزي وزو</option>
              <option :value="19">19 - سطيف</option>
              <option :value="23">23 - عنابة</option>
              <option :value="35">35 - بومرداس</option>
              <option :value="42">42 - تيبازة</option>
              <option :value="13">13 - تلمسان</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-2">العنوان الدقيق للورشة / نقطة الاستلام</label>
            <input
              v-model="form.address"
              type="text"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="مثال: حيدرة، الجزائر العاصمة"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-300 mb-2">نبذة تعريفية وتخصصات الورشة</label>
          <textarea
            v-model="form.bio"
            rows="3"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-pink-500 transition-colors"
            placeholder="اكتب نبذة موجزة تظهر للزبائن عن خبرتكم في صناعة الحلويات..."
          ></textarea>
        </div>
      </div>

      <!-- Section 2: Production & Capacity -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Calendar class="w-5 h-5 text-pink-500" />
          الطاقة التشغيلية والإنتاج اليومي
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">
              الحد الأقصى للكعكات / اليوم
            </label>
            <p class="text-xs text-zinc-500 mb-3">
              الحد الأقصى من الطلبيات المعقدة التي يمكن للورشة تصنيعها في اليوم الواحد لتجنب الضغط
            </p>
            <div class="flex items-center gap-3">
              <input
                v-model.number="form.dailyCapacity"
                type="number"
                min="1"
                max="30"
                class="w-32 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-base font-bold text-white text-center focus:outline-none focus:border-pink-500"
              />
              <span class="text-sm text-zinc-400">طلبيات / كعكات كحد أقصى يومياً</span>
            </div>
          </div>

          <div class="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div class="font-bold text-white text-sm">وضع العطلة (إيقاف الطلبات)</div>
              <div class="text-xs text-zinc-400 mt-0.5">
                تفعيل هذا الخيار يمنع الزبائن مؤقتاً من حجز مواعيد تسليم جديدة
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.isVacationMode" class="sr-only peer" />
              <div class="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3: Payment Methods -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <h2 class="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <CreditCard class="w-5 h-5 text-pink-500" />
          خيارات الدفع المقبولة في الورشة
        </h2>

        <div class="space-y-4">
          <!-- Cash on delivery -->
          <div class="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Banknote class="w-5 h-5" />
              </div>
              <div>
                <div class="font-bold text-white text-sm">الدفع نقدًا عند الاستلام والتوصيل</div>
                <div class="text-xs text-zinc-400 mt-0.5">تسليم المبلغ نقداً بالدينار الجزائري لعمال التوصيل أو بالورشة</div>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.acceptCash" class="sr-only peer" />
              <div class="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <!-- BaridiMob -->
          <div class="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Smartphone class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-bold text-white text-sm">بريدي موب (BaridiMob RIP)</div>
                  <div class="text-xs text-zinc-400 mt-0.5">السماح للزبائن بالتحويل الفوري عبر تطبيق بريدي موب بريد الجزائر</div>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.acceptBaridiMob" class="sr-only peer" />
                <div class="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div v-if="form.acceptBaridiMob" class="pt-2 border-t border-zinc-800/80">
              <label class="block text-xs font-semibold text-zinc-300 mb-1.5">
                رقم الحساب البريدي الجاري RIP (20 رقماً)
              </label>
              <input
                v-model="form.baridiMobRip"
                type="text"
                dir="ltr"
                maxlength="20"
                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 font-mono text-sm text-amber-400 text-left focus:outline-none focus:border-amber-500"
                placeholder="00799999000123456789"
              />
            </div>
          </div>

          <!-- CIB / Edahabia -->
          <div class="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                <CreditCard class="w-5 h-5" />
              </div>
              <div>
                <div class="font-bold text-white text-sm">البطاقة الذهبية / بطاقة CIB البنكية</div>
                <div class="text-xs text-zinc-400 mt-0.5">الدفع الإلكتروني عبر بوابة SATIM الآمنة</div>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.acceptCIB" class="sr-only peer" />
              <div class="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-base font-bold shadow-lg shadow-pink-600/30 transition-all disabled:opacity-50"
        >
          <Check v-if="!isSaving" class="w-5 h-5" />
          <Loader2 v-else class="w-5 h-5 animate-spin" />
          {{ isSaving ? 'جارٍ الحفظ والتحديث...' : 'حفظ كل الإعدادات' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import {
  Settings,
  Store,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-vue-next';

const store = useOrderStore();
const isSaving = ref(false);
const toastMessage = ref('');

const form = reactive({
  storeName: '',
  chefName: '',
  phone: '',
  whatsappNumber: '',
  wilayaCode: 16,
  address: '',
  bio: '',
  dailyCapacity: 5,
  acceptCash: true,
  acceptBaridiMob: true,
  baridiMobRip: '',
  acceptCIB: true,
  isVacationMode: false
});

onMounted(() => {
  store.loadSettings();
  Object.assign(form, store.settings);
});

async function saveAllSettings() {
  isSaving.value = true;
  try {
    store.updateSettings({ ...form });
    toastMessage.value = 'تم حفظ وتحديث إعدادات الورشة والحساب بنجاح!';
    setTimeout(() => {
      toastMessage.value = '';
    }, 4000);
  } finally {
    isSaving.value = false;
  }
}
</script>

