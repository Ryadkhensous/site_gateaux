<script setup lang="ts">
import { ref } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import {
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  UploadCloud,
  Trash2,
  Image as ImageIcon
} from 'lucide-vue-next';
import { formatDZD } from '../utils/format';

const store = useOrderStore();

// حالة إضافة منتج جديد
const showAddModal = ref(false);
const newName = ref('');
const newCategory = ref('MODERNE');
const newPrice = ref(7500);
const newPrepDays = ref(3);
const newDescription = ref('');
const newImageUrl = ref('');
const isCustomizable = ref(true);
const successMsg = ref('');

// حالة رفع الملفات من الحاسوب
const fileInputRef = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadedPreview = ref('');
const uploadFileName = ref('');

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadFileName.value = file.name;
  isUploading.value = true;

  // معاينة سريعة فورية للمستخدم
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // رفع الملف إلى الخادم أو حفظه كـ Base64 Data URL
  const res = await store.uploadImage(file);
  if (res.success && res.url) {
    newImageUrl.value = res.url;
  } else {
    newImageUrl.value = uploadedPreview.value;
  }
  isUploading.value = false;
};

const removeUploadedImage = () => {
  uploadedPreview.value = '';
  uploadFileName.value = '';
  newImageUrl.value = '';
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const handleCreateProduct = async () => {
  if (!newName.value || !newPrice.value) return;

  const res = await store.addNewProduct({
    name: newName.value,
    category: newCategory.value,
    priceDZD: Number(newPrice.value),
    prepTimeDays: Number(newPrepDays.value),
    description: newDescription.value,
    imageUrl: newImageUrl.value || uploadedPreview.value || '/images/hero_wedding_cake.jpg',
    isCustomizable: isCustomizable.value,
    tags: ['صنع يدوي حرفي', 'حلويات جزائرية فاخرة']
  });

  if (res.success) {
    successMsg.value = 'تمت إضافة الحلوى إلى واجهتك بنجاح وعرضها على المنصة الوطنية !';
    showAddModal.value = false;
    newName.value = '';
    newDescription.value = '';
    newImageUrl.value = '';
    uploadedPreview.value = '';
    uploadFileName.value = '';
    setTimeout(() => {
      successMsg.value = '';
    }, 4000);
  }
};

const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case 'MARIAGE': return 'أعراس ومناسبات كبرى';
    case 'TRADITIONNEL': return 'حلويات تقليدية أصيلة';
    case 'B2B_ENTREPRISE': return 'بوفيهات الشركات B2B';
    default: return 'عصري وتورتات فاخرة';
  }
};
</script>

<template>
  <div class="space-y-6 text-right">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-stone-900">
          معرض إبداعاتي وكتالوج الحلويات
        </h1>
        <p class="text-xs text-stone-500 mt-0.5">
          اعرض خبرتك وابتكاراتك في صناعة الحلويات للزبائن في كافة ولايات الجزائر.
        </p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-4 py-2.5 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200/50 flex items-center gap-2 self-start sm:self-auto transition-all"
      >
        <Plus class="w-4 h-4" />
        <span>إضافة حلوى أو كعكة جديدة</span>
      </button>
    </div>

    <div v-if="successMsg" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
      <CheckCircle2 class="w-4 h-4 text-rose-600" />
      <span>{{ successMsg }}</span>
    </div>

    <!-- بطاقة هوية الحرفي والورشة -->
    <div v-if="store.currentArtisan" class="bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <img
          :src="store.currentArtisan.avatar"
          alt="صورة الحرفي"
          class="w-20 h-20 rounded-2xl object-cover border-2 border-dore-300 shadow-md"
        />
        <div class="space-y-1.5 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-xl font-serif font-bold text-stone-900">
              {{ store.currentArtisan.storeNameAr || store.currentArtisan.storeName }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <ShieldCheck class="w-3 h-3 text-dore-600" /> حرفي معتمد
            </span>
          </div>
          <p class="text-xs text-stone-600 leading-relaxed font-light">
            {{ store.currentArtisan.bioAr || store.currentArtisan.bio }}
          </p>
          <div class="flex flex-wrap gap-2 pt-1 text-xs text-stone-500">
            <span>📍 {{ store.currentArtisan.address }} (ولاية {{ store.currentArtisan.wilayaCode.toString().padStart(2, '0') }})</span>
            <span>•</span>
            <span class="font-mono text-left" dir="ltr">📞 {{ store.currentArtisan.phone }}</span>
            <span>•</span>
            <span class="font-bold text-dore-700">★ {{ store.currentArtisan.rating }} ({{ store.currentArtisan.reviewsCount }} تقييم)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- شبكة منتجات الكتالوج المعروضة -->
    <div>
      <h3 class="text-base font-serif font-bold text-stone-900 mb-4">
        الحلويات المعروضة في متجرك الوطني ({{ store.products.length }})
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="prod in store.products"
          :key="prod.id"
          class="bg-white rounded-2xl overflow-hidden border border-beige-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-rose-200 transition-all"
        >
          <div>
            <div class="h-44 bg-beige-50 relative overflow-hidden">
              <img :src="prod.imageUrl" :alt="prod.nameAr || prod.name" class="w-full h-full object-cover" />
              <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-stone-800 shadow-sm border border-beige-200">
                {{ getCategoryLabel(prod.category) }}
              </span>
              <span v-if="prod.isCustomizable" class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-xs flex items-center gap-1">
                <Sparkles class="w-2.5 h-2.5" /> 3D
              </span>
            </div>
            <div class="p-4 space-y-1.5">
              <h4 class="font-serif font-bold text-sm text-stone-900">{{ prod.nameAr || prod.name }}</h4>
              <p class="text-xs text-stone-500 line-clamp-2 font-light">{{ prod.descriptionAr || prod.description }}</p>
            </div>
          </div>

          <div class="p-4 pt-0">
            <div class="pt-3 border-t border-beige-100 flex items-baseline justify-between text-xs">
              <span class="inline-flex items-baseline gap-1" dir="rtl">
                <span dir="ltr" class="font-mono font-bold text-stone-900 text-base tracking-tight">{{ formatDZD(prod.priceDZD) }}</span>
                <span class="text-xs text-dore-700 font-sans font-bold">دج</span>
              </span>
              <span class="text-stone-400 font-medium flex items-center gap-1">
                <Clock class="w-3 h-3 text-stone-400" /> {{ prod.prepTimeDays }} أيام تحضير
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- نافذة إضافة منتج جديد -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-rose-100 text-right">
        <h3 class="text-lg font-serif font-bold text-stone-900">إضافة حلوى أو كعكة جديدة إلى الكتالوج</h3>

        <form @submit.prevent="handleCreateProduct" class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-stone-700 block mb-1">اسم الحلوى أو الكعكة *</label>
            <input
              type="text"
              required
              v-model="newName"
              placeholder="مثال: كعكة الورد والبراليني الملكي"
              class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-stone-700 block mb-1">التصنيف</label>
              <select
                v-model="newCategory"
                class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-medium"
              >
                <option value="MODERNE">عصري وتورتات فاخرة</option>
                <option value="TRADITIONNEL">حلويات تقليدية أصيلة</option>
                <option value="MARIAGE">أعراس ومناسبات كبرى</option>
                <option value="B2B_ENTREPRISE">بوفيهات الشركات B2B</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-semibold text-stone-700 block mb-1">السعر الأساسي (دج) *</label>
              <input
                type="number"
                required
                v-model="newPrice"
                class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-stone-700 block mb-1">مدة التحضير (بالأيام)</label>
              <input
                type="number"
                v-model="newPrepDays"
                class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-mono"
              />
            </div>
            <div class="flex items-center pt-5">
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input type="checkbox" v-model="isCustomizable" class="rounded text-rose-600" />
                <span>قابلة للتخصيص 3D</span>
              </label>
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-700 block mb-1.5">
              صورة الكعكة أو الحلوى *
            </label>

            <!-- حقل اختيار الملف المخفي -->
            <input
              type="file"
              ref="fileInputRef"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />

            <!-- حالة 1: تم تحديد أو رفع صورة (معاينة بطاقة الصورة) -->
            <div
              v-if="uploadedPreview || newImageUrl"
              class="p-3 bg-rose-50/50 border-2 border-rose-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <img
                  :src="uploadedPreview || newImageUrl"
                  alt="معاينة الصورة"
                  class="w-14 h-14 rounded-xl object-cover border border-rose-300 shadow-xs flex-shrink-0 bg-white"
                />
                <div class="text-right truncate">
                  <span class="text-xs font-bold text-stone-900 block truncate">
                    {{ uploadFileName || 'صورة جاهزة للنشر' }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    تم تحديد ومعاينة الصورة بنجاح
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-3 py-1.5 bg-white hover:bg-beige-100 text-stone-800 text-xs font-bold rounded-xl border border-beige-300 transition-colors shadow-2xs"
                >
                  تغيير
                </button>
                <button
                  type="button"
                  @click="removeUploadedImage"
                  class="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition-colors"
                  title="حذف الصورة"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- حالة 2: لم يتم تحديد صورة بعد (زر تصفح ملفات الحاسوب) -->
            <div v-else class="space-y-2">
              <button
                type="button"
                @click="triggerFileInput"
                class="w-full py-4 px-4 bg-rose-50/70 hover:bg-rose-100/80 border-2 border-dashed border-rose-300 hover:border-rose-400 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-2xs"
              >
                <div class="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <UploadCloud class="w-5 h-5" />
                </div>
                <span class="text-xs font-bold text-stone-800 group-hover:text-rose-700 transition-colors">
                  تصفح ورفع صورة من ملفات جهازك (Téléverser depuis le PC)
                </span>
                <span class="text-[10px] text-stone-500 font-light">
                  يدعم صيغ JPG, PNG, WEBP حتى 10 ميغابايت
                </span>
              </button>

              <!-- حقل يدوي اختياري إذا أراد كتابة رابط -->
              <div class="pt-0.5">
                <input
                  type="text"
                  v-model="newImageUrl"
                  placeholder="أو اكتب مساراً/رابطاً يدوياً (مثال: /images/hero_wedding_cake.jpg)"
                  class="w-full p-2 bg-beige-50 border border-beige-300 rounded-xl text-xs font-mono text-left"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-stone-700 block mb-1">وصف المكونات والذوق</label>
            <textarea
              rows="2"
              v-model="newDescription"
              placeholder="تفاصيل حول القوام، نكهات الجينواز والحشوات..."
              class="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs"
            ></textarea>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 py-2.5 bg-beige-100 hover:bg-beige-200 text-stone-700 rounded-xl text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200/50"
            >
              نشر في المتجر الوطني
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
