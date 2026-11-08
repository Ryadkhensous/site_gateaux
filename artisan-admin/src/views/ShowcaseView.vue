<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Store class="w-7 h-7 text-pink-600" />
          معرض إبداعاتي وكتالوج الحلويات
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          إدارة وتعديل الكتالوج الوطني، تحديد الأسعار بالدينار الجزائري وتحديث مواصفات الحلويات المعروضة للزبائن
        </p>
      </div>

      <button
        @click="openAddModal"
        class="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-2 self-start sm:self-auto transition-all"
      >
        <Plus class="w-4 h-4" />
        <span>إضافة حلوى أو كعكة جديدة</span>
      </button>
    </div>

    <!-- Alert / Toast -->
    <div
      v-if="toastMsg"
      class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{{ toastMsg }}</span>
      </div>
      <button @click="toastMsg = ''" class="text-emerald-700 hover:text-emerald-900">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Workshop Profile Banner -->
    <div v-if="store.currentArtisan" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <img
          :src="store.currentArtisan.avatar"
          alt="صورة الحرفي"
          class="w-16 h-16 rounded-2xl object-cover border-2 border-pink-200 shadow-sm bg-slate-100"
        />
        <div class="space-y-1.5 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-lg font-bold text-slate-900">
              {{ store.currentArtisan.storeNameAr || store.currentArtisan.storeName }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200 flex items-center gap-1">
              <ShieldCheck class="w-3.5 h-3.5 text-pink-600" />
              حرفي معتمد في الجزائر
            </span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-light">
            {{ store.currentArtisan.bioAr || store.currentArtisan.bio }}
          </p>
          <div class="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5 text-pink-600" />
              {{ store.currentArtisan.address }} (ولاية {{ store.currentArtisan.wilayaCode }})
            </span>
            <span class="text-slate-300">•</span>
            <span class="font-mono text-left flex items-center gap-1" dir="ltr">
              <Phone class="w-3.5 h-3.5 text-slate-400" />
              {{ store.currentArtisan.phone }}
            </span>
            <span class="text-slate-300">•</span>
            <span class="font-bold text-amber-600 flex items-center gap-1">
              <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {{ store.currentArtisan.rating }} ({{ store.currentArtisan.reviewsCount }} تقييم)
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar: Search & Categories -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
      <div class="relative w-full md:w-80">
        <Search class="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث عن حلوى، كعكة أو مكوّن..."
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pr-11 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="selectedCategory = cat.value"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            selectedCategory === cat.value
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div>
      <div v-if="filteredProducts.length === 0" class="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 shadow-xs">
        <Store class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p class="text-base font-semibold text-slate-700">لا توجد حلويات مطابقة لهذا التصنيف أو البحث</p>
        <p class="text-xs text-slate-400 mt-1">جرب اختيار تصنيف آخر أو إضافة منتج جديد</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="prod in filteredProducts"
          :key="prod.id"
          class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-pink-300 shadow-xs hover:shadow-sm flex flex-col justify-between transition-all group"
        >
          <div>
            <!-- Image with badges -->
            <div class="h-48 bg-slate-100 relative overflow-hidden">
              <img
                :src="prod.imageUrl"
                :alt="prod.nameAr || prod.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                {{ getCategoryLabel(prod.category) }}
              </span>
              <span
                v-if="prod.isCustomizable"
                class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-pink-600 text-white flex items-center gap-1 shadow-sm"
              >
                <Sparkles class="w-3 h-3" />
                تخصيص 3D
              </span>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-2">
              <h4 class="font-bold text-sm text-slate-900">{{ prod.nameAr || prod.name }}</h4>
              <p class="text-xs text-slate-500 line-clamp-2 font-light leading-relaxed">
                {{ prod.descriptionAr || prod.description }}
              </p>
            </div>
          </div>

          <!-- Bottom Footer & Actions -->
          <div class="p-5 pt-0">
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mb-3">
              <span class="font-bold text-pink-600 text-base font-mono">
                {{ formatPrice(prod.priceDZD) }} دج
              </span>
              <span class="text-slate-500 flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-slate-400" />
                {{ prod.prepTimeDays }} أيام تحضير
              </span>
            </div>

            <!-- Edit & Delete buttons -->
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="openEditModal(prod)"
                class="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Edit2 class="w-3.5 h-3.5 text-pink-600" />
                <span>تعديل السعر</span>
              </button>
              <button
                @click="confirmDeleteProduct(prod)"
                class="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold border border-red-200 transition-colors"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>حذف الحلوى</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add New Product -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      @click.self="showAddModal = false"
    >
      <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <button @click="showAddModal = false" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X class="w-5 h-5" />
          </button>
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus class="w-5 h-5 text-pink-600" />
            إضافة حلوى أو كعكة جديدة إلى الكتالوج
          </h3>
        </div>

        <form @submit.prevent="handleCreateProduct" class="space-y-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">اسم الحلوى أو الكعكة *</label>
            <input
              type="text"
              required
              v-model="newForm.name"
              placeholder="مثال: كعكة الورد والبراليني الملكي"
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">التصنيف *</label>
              <select
                v-model="newForm.category"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 font-medium focus:bg-white"
              >
                <option value="MODERNE">عصري وتورتات فاخرة</option>
                <option value="TRADITIONNEL">حلويات تقليدية أصيلة</option>
                <option value="MARIAGE">أعراس ومناسبات كبرى</option>
                <option value="B2B_ENTREPRISE">بوفيهات الشركات B2B</option>
              </select>
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">السعر الأساسي (دج) *</label>
              <input
                type="number"
                required
                v-model.number="newForm.priceDZD"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">مدة التحضير (أيام)</label>
              <input
                type="number"
                v-model.number="newForm.prepTimeDays"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">عدد الأفراد التقريبي</label>
              <input
                type="number"
                v-model.number="newForm.servings"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <!-- Upload Image -->
          <div>
            <label class="font-bold text-slate-700 block mb-1.5">صورة الكعكة أو الحلوى *</label>
            <input
              type="file"
              ref="fileInputRef"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />

            <div
              v-if="uploadedPreview || newForm.imageUrl"
              class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <img
                  :src="uploadedPreview || newForm.imageUrl"
                  alt="معاينة"
                  class="w-12 h-12 rounded-lg object-cover border border-slate-300 bg-white shrink-0"
                />
                <span class="text-xs text-slate-800 font-bold truncate">تم تحديد الصورة بنجاح</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-slate-300 text-[11px]"
                >
                  تغيير
                </button>
                <button
                  type="button"
                  @click="removeUploadedImage"
                  class="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div v-else class="space-y-1.5">
              <button
                type="button"
                @click="triggerFileInput"
                class="w-full py-3 px-3 bg-slate-50 hover:bg-pink-50/50 border border-dashed border-slate-300 hover:border-pink-400 rounded-xl flex items-center justify-center gap-2 text-pink-700 transition-colors"
              >
                <UploadCloud class="w-4 h-4 text-pink-600" />
                <span>رفع صورة من جهاز الحاسوب</span>
              </button>
              <input
                type="text"
                v-model="newForm.imageUrl"
                placeholder="أو اكتب مساراً محلياً (مثال: /images/hero_wedding_cake.jpg)"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-left font-mono focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">وصف المكونات والذوق</label>
            <textarea
              rows="2"
              v-model="newForm.description"
              placeholder="تفاصيل حول القوام، نكهات الجينواز والحشوات الفاخرة..."
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="isCustomizable" v-model="newForm.isCustomizable" class="rounded text-pink-600 focus:ring-0" />
            <label for="isCustomizable" class="font-bold text-slate-700 cursor-pointer">
              إتاحة التخصيص ثلاثي الأبعاد (3D Studio) للزبائن
            </label>
          </div>

          <div class="flex gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md shadow-pink-500/20 transition-all"
            >
              نشر في المتجر الوطني
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Edit Existing Product -->
    <div
      v-if="editingProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      @click.self="editingProduct = null"
    >
      <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-right space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <button @click="editingProduct = null" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X class="w-5 h-5" />
          </button>
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Edit2 class="w-5 h-5 text-pink-600" />
            تعديل بيانات: {{ editingProduct.nameAr || editingProduct.name }}
          </h3>
        </div>

        <form @submit.prevent="handleSaveProductEdit" class="space-y-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">اسم الحلوى أو الكعكة</label>
            <input
              type="text"
              required
              v-model="editForm.name"
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">السعر (دج) *</label>
              <input
                type="number"
                required
                v-model.number="editForm.priceDZD"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">مدة التحضير (أيام)</label>
              <input
                type="number"
                v-model.number="editForm.prepTimeDays"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">عدد الأفراد (حجم الحصة)</label>
              <input
                type="number"
                v-model.number="editForm.servings"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-pink-500 focus:bg-white"
              />
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">التصنيف</label>
              <select
                v-model="editForm.category"
                class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
              >
                <option value="MODERNE">عصري وتورتات فاخرة</option>
                <option value="TRADITIONNEL">حلويات تقليدية أصيلة</option>
                <option value="MARIAGE">أعراس ومناسبات كبرى</option>
                <option value="B2B_ENTREPRISE">بوفيهات الشركات B2B</option>
              </select>
            </div>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">وصف المكونات والذوق</label>
            <textarea
              rows="3"
              v-model="editForm.description"
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="editCustomizable" v-model="editForm.isCustomizable" class="rounded text-pink-600 focus:ring-0" />
            <label for="editCustomizable" class="font-bold text-slate-700 cursor-pointer">
              إتاحة التخصيص ثلاثي الأبعاد (3D Studio)
            </label>
          </div>

          <div class="flex gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="editingProduct = null"
              class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md shadow-pink-500/20 transition-all"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { Product } from '../types';
import {
  Store,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  UploadCloud,
  Trash2,
  MapPin,
  Phone,
  Star,
  Search,
  Edit2,
  X
} from 'lucide-vue-next';

const store = useOrderStore();

const searchQuery = ref('');
const selectedCategory = ref('ALL');
const toastMsg = ref('');

const categories = [
  { value: 'ALL', label: 'الكل' },
  { value: 'MARIAGE', label: 'أعراس ومناسبات كبرى' },
  { value: 'TRADITIONNEL', label: 'حلويات تقليدية أصيلة' },
  { value: 'MODERNE', label: 'عصري وتورتات فاخرة' },
  { value: 'B2B_ENTREPRISE', label: 'بوفيهات الشركات B2B' }
];

const filteredProducts = computed(() => {
  return store.products.filter((p) => {
    // category filter
    if (selectedCategory.value !== 'ALL' && p.category !== selectedCategory.value) {
      return false;
    }
    // search filter
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return true;
    const name = (p.nameAr || p.name).toLowerCase();
    const desc = (p.descriptionAr || p.description || '').toLowerCase();
    return name.includes(q) || desc.includes(q);
  });
});

// Add Modal State
const showAddModal = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadedPreview = ref('');

const newForm = reactive({
  name: '',
  category: 'MODERNE',
  priceDZD: 7500,
  prepTimeDays: 3,
  servings: 12,
  description: '',
  imageUrl: '',
  isCustomizable: true
});

function openAddModal() {
  newForm.name = '';
  newForm.category = 'MODERNE';
  newForm.priceDZD = 7500;
  newForm.prepTimeDays = 3;
  newForm.servings = 12;
  newForm.description = '';
  newForm.imageUrl = '';
  newForm.isCustomizable = true;
  uploadedPreview.value = '';
  showAddModal.value = true;
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  const res = await store.uploadImage(file);
  if (res.success && res.url) {
    newForm.imageUrl = res.url;
  } else {
    newForm.imageUrl = uploadedPreview.value;
  }
}

function removeUploadedImage() {
  uploadedPreview.value = '';
  newForm.imageUrl = '';
  if (fileInputRef.value) fileInputRef.value.value = '';
}

async function handleCreateProduct() {
  if (!newForm.name || !newForm.priceDZD) return;

  const res = await store.addNewProduct({
    name: newForm.name,
    category: newForm.category,
    priceDZD: Number(newForm.priceDZD),
    prepTimeDays: Number(newForm.prepTimeDays),
    servings: Number(newForm.servings),
    description: newForm.description,
    imageUrl: newForm.imageUrl || uploadedPreview.value || '/images/hero_wedding_cake.jpg',
    isCustomizable: newForm.isCustomizable,
    tags: ['صنع يدوي حرفي', 'حلويات جزائرية فاخرة']
  });

  if (res.success) {
    toastMsg.value = 'تمت إضافة الحلوى إلى واجهتك بنجاح وعرضها على المنصة الوطنية!';
    showAddModal.value = false;
    setTimeout(() => {
      toastMsg.value = '';
    }, 4000);
  }
}

// Edit Modal State
const editingProduct = ref<Product | null>(null);
const editForm = reactive({
  name: '',
  category: 'MODERNE',
  priceDZD: 0,
  prepTimeDays: 1,
  servings: 1,
  description: '',
  isCustomizable: true
});

function openEditModal(prod: Product) {
  editingProduct.value = prod;
  editForm.name = prod.nameAr || prod.name;
  editForm.category = prod.category;
  editForm.priceDZD = prod.priceDZD;
  editForm.prepTimeDays = prod.prepTimeDays;
  editForm.servings = prod.servings || 10;
  editForm.description = prod.descriptionAr || prod.description || '';
  editForm.isCustomizable = prod.isCustomizable;
}

function handleSaveProductEdit() {
  if (!editingProduct.value) return;
  store.updateProduct(editingProduct.value.id, {
    name: editForm.name,
    nameAr: editForm.name,
    category: editForm.category,
    priceDZD: editForm.priceDZD,
    prepTimeDays: editForm.prepTimeDays,
    servings: editForm.servings,
    description: editForm.description,
    descriptionAr: editForm.description,
    isCustomizable: editForm.isCustomizable
  });
  toastMsg.value = `تم تحديث مواصفات "${editForm.name}" بنجاح!`;
  editingProduct.value = null;
  setTimeout(() => {
    toastMsg.value = '';
  }, 4000);
}

function confirmDeleteProduct(prod: Product) {
  if (confirm(`هل أنت متأكد من حذف "${prod.nameAr || prod.name}" من كتالوج المعرض؟`)) {
    store.deleteProduct(prod.id);
    toastMsg.value = `تم حذف "${prod.nameAr || prod.name}" من المعرض.`;
    setTimeout(() => {
      toastMsg.value = '';
    }, 4000);
  }
}

function formatPrice(val: number): string {
  return (val || 0).toLocaleString('fr-DZ');
}

function getCategoryLabel(cat: string): string {
  switch (cat) {
    case 'MARIAGE':
      return 'أعراس ومناسبات كبرى';
    case 'TRADITIONNEL':
      return 'حلويات تقليدية أصيلة';
    case 'B2B_ENTREPRISE':
      return 'بوفيهات الشركات B2B';
    default:
      return 'عصري وتورتات فاخرة';
  }
}
</script>
