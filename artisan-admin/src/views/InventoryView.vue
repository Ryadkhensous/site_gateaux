<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { InventoryItem } from '../types';
import { formatDZD } from '../utils/format';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  TrendingDown,
  Trash2,
  DollarSign,
  Layers,
  ChevronDown,
  RefreshCw
} from 'lucide-vue-next';

const store = useOrderStore();

const searchQuery = ref('');
const selectedCategory = ref('ALL');
const showAddModal = ref(false);

// نموذج إضافة مادة أولية جديدة
const newItemName = ref('');
const newItemCategory = ref('مكسرات ولوز');
const newItemStock = ref(10);
const newItemUnit = ref('كغ');
const newItemThreshold = ref(3);
const newItemCost = ref(1500);
const newItemSupplier = ref('');

const categories = [
  'ALL',
  'مكسرات ولوز',
  'شوكولاتة وكاكاو',
  'عسل وسكريات',
  'ألبان ودهون',
  'مواد التزيين',
  'تغليف وتبريد'
];

const filteredInventory = computed(() => {
  return store.inventory.filter((item) => {
    if (selectedCategory.value !== 'ALL' && item.category !== selectedCategory.value) {
      return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(q))
      );
    }
    return true;
  });
});

const handleAdjustStock = (item: InventoryItem, delta: number) => {
  store.updateInventoryStock(item.id, item.currentStock + delta);
};

const handleAddNewItem = () => {
  if (!newItemName.value.trim()) return;

  store.addInventoryItem({
    name: newItemName.value.trim(),
    category: newItemCategory.value,
    currentStock: Number(newItemStock.value),
    unit: newItemUnit.value,
    minThreshold: Number(newItemThreshold.value),
    costPerUnitDZD: Number(newItemCost.value),
    supplierName: newItemSupplier.value.trim() || undefined
  });

  // إعادة ضبط النموذج
  newItemName.value = '';
  newItemStock.value = 10;
  newItemCost.value = 1500;
  newItemSupplier.value = '';
  showAddModal.value = false;
};

const handleDeleteItem = (id: string) => {
  if (confirm('هل أنت متأكد من حذف هذه المادة الأولية من سجل المخزون ؟')) {
    store.deleteInventoryItem(id);
  }
};
</script>

<template>
  <div class="space-y-6 text-right">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-stone-900">
          مخزون المواد الأولية ومستلزمات الورشة
        </h1>
        <p class="text-xs text-stone-500 mt-0.5 font-light">
          متابعة كميات اللوز، الشوكولاتة، العسل، ورق الذهب ومواد التغليف لمنع أي نقص أثناء تصنيع الكعكات.
        </p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-4 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>إضافة مادة أولية جديدة</span>
      </button>
    </div>

    <!-- بطاقات الإحصاءات العامة للمخزون -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- القيمة الإجمالية للمخزون -->
      <div class="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold">
          <span>القيمة الإجمالية للمخزون</span>
          <span class="w-7 h-7 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-xs">
            دج
          </span>
        </div>
        <div class="font-mono font-bold text-2xl text-stone-900 inline-flex items-baseline gap-1" dir="rtl">
          <span dir="ltr">{{ formatDZD(store.totalInventoryValueDZD) }}</span>
          <span class="text-xs font-bold text-[#E84375]">دج</span>
        </div>
        <span class="text-[10px] text-stone-400 font-light block">
          محسوبة على أساس تكلفة الشراء
        </span>
      </div>

      <!-- إجمالي المواد المسجلة -->
      <div class="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold">
          <span>المواد المسجلة في الورشة</span>
          <Package class="w-4 h-4 text-stone-400" />
        </div>
        <div class="font-mono font-bold text-2xl text-stone-900">
          {{ store.inventory.length }} صنف
        </div>
        <span class="text-[10px] text-stone-400 font-light block">
          مكسرات، شوكولاتة، دهون وتغليف
        </span>
      </div>

      <!-- تنبيه المواد التي أوشكت على النفاد -->
      <div class="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs text-stone-400 font-bold">
          <span>مواد أوشكت على النفاد</span>
          <AlertTriangle
            :class="['w-4 h-4', store.lowStockItemsCount > 0 ? 'text-amber-500 animate-bounce' : 'text-stone-300']"
          />
        </div>
        <div
          class="font-mono font-bold text-2xl"
          :class="store.lowStockItemsCount > 0 ? 'text-amber-600' : 'text-stone-900'"
        >
          {{ store.lowStockItemsCount }} مواد حرجة
        </div>
        <span class="text-[10px] text-stone-400 font-light block">
          تحت عتبة الأمان الدنيا
        </span>
      </div>
    </div>

    <!-- تنبيه النفاد إذا وجد -->
    <div
      v-if="store.lowStockItemsCount > 0"
      class="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900"
    >
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span>
          يوجد <strong>{{ store.lowStockItemsCount }}</strong> مواد في ورشتك وصلت إلى الحد الأدنى؛ يُرجى إعادة التموين لضمان تلبية طلبيات الكعكات القادمة دون تأخير.
        </span>
      </div>
    </div>

    <!-- شريط البحث والتصنيفات -->
    <div class="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
      <!-- حقل البحث -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ابحث عن مادة أولية (لوز، شوكولاتة، كرتون...) أو اسم المورد..."
          class="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all"
        />
      </div>

      <!-- فلتر الصنف -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
            selectedCategory === cat ? 'bg-[#E84375] text-white shadow-xs' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          ]"
        >
          {{ cat === 'ALL' ? 'كافة الأصناف' : cat }}
        </button>
      </div>
    </div>

    <!-- جدول / شبكة المواد الأولية -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in filteredInventory"
        :key="item.id"
        class="bg-white rounded-2xl border border-stone-200 hover:border-pink-300 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
      >
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 block w-fit mb-1">
                {{ item.category }}
              </span>
              <h3 class="font-bold text-sm text-stone-900 group-hover:text-[#E84375] transition-colors leading-snug">
                {{ item.name }}
              </h3>
            </div>
            <button
              @click="handleDeleteItem(item.id)"
              title="حذف المادة"
              class="text-stone-300 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <span class="text-stone-500 font-light">المورد :</span>
            <span class="font-semibold text-stone-800">{{ item.supplierName || 'مورد محلي' }}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-stone-500 font-light">التكلفة للوحدة :</span>
            <span class="font-mono font-bold text-stone-800">{{ formatDZD(item.costPerUnitDZD) }} دج / {{ item.unit }}</span>
          </div>
        </div>

        <!-- عداد الكمية ومؤشر الحالة -->
        <div class="pt-3 border-t border-stone-100 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-light text-stone-500">الكمية المتوفرة حالياً :</span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold',
                item.currentStock <= item.minThreshold
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              ]"
            >
              {{ item.currentStock }} {{ item.unit }}
            </span>
          </div>

          <!-- أزرار التعديل السريع (+ و -) -->
          <div class="flex items-center justify-between gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
            <div class="flex items-center gap-1">
              <button
                @click="handleAdjustStock(item, -1)"
                title="إنقاص 1"
                class="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center border border-stone-200 transition-colors cursor-pointer"
              >
                -1
              </button>
              <button
                @click="handleAdjustStock(item, -5)"
                title="إنقاص 5"
                class="px-2 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-200 transition-colors cursor-pointer"
              >
                -5
              </button>
            </div>

            <span class="text-[10px] text-stone-400 font-light">
              حد الأمان: {{ item.minThreshold }} {{ item.unit }}
            </span>

            <div class="flex items-center gap-1">
              <button
                @click="handleAdjustStock(item, 1)"
                title="إضافة 1"
                class="w-8 h-8 rounded-lg bg-white hover:bg-pink-50 text-[#E84375] font-bold text-sm flex items-center justify-center border border-pink-200 transition-colors cursor-pointer"
              >
                +1
              </button>
              <button
                @click="handleAdjustStock(item, 5)"
                title="إضافة 5"
                class="px-2 h-8 rounded-lg bg-white hover:bg-pink-50 text-[#E84375] font-bold text-xs flex items-center justify-center border border-pink-200 transition-colors cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- نافذة إضافة مادة أولية جديدة (Modal) -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-100 text-right">
        <div class="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 class="text-lg font-serif font-bold text-stone-900">
            إضافة مادة أولية جديدة إلى الورشة
          </h3>
          <button @click="showAddModal = false" class="text-stone-400 hover:text-stone-700 font-bold p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleAddNewItem" class="space-y-4 text-xs font-semibold text-stone-700">
          <div>
            <label class="block mb-1">اسم المادة الأولية *</label>
            <input
              type="text"
              v-model="newItemName"
              required
              placeholder="مثال: لوز بلدي مرحي، شوكولاتة بلجيكية 70%..."
              class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-1">التصنيف *</label>
              <select
                v-model="newItemCategory"
                class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="مكسرات ولوز">مكسرات ولوز</option>
                <option value="شوكولاتة وكاكاو">شوكولاتة وكاكاو</option>
                <option value="عسل وسكريات">عسل وسكريات</option>
                <option value="ألبان ودهون">ألبان ودهون</option>
                <option value="مواد التزيين">مواد التزيين</option>
                <option value="تغليف وتبريد">تغليف وتبريد</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">وحدة القياس *</label>
              <select
                v-model="newItemUnit"
                class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="كغ">كيلوغرام (كغ)</option>
                <option value="لتر">لتر (L)</option>
                <option value="علبة">علبة (boîte)</option>
                <option value="ورقة">ورقة (feuille)</option>
                <option value="قطعة">قطعة (pièce)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block mb-1">الكمية الأولية *</label>
              <input
                type="number"
                step="0.5"
                v-model="newItemStock"
                required
                class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 font-mono"
              />
            </div>
            <div>
              <label class="block mb-1">حد الأمان الأدنى *</label>
              <input
                type="number"
                step="0.5"
                v-model="newItemThreshold"
                required
                class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 font-mono"
              />
            </div>
            <div>
              <label class="block mb-1">السعر / الوحدة (دج)</label>
              <input
                type="number"
                v-model="newItemCost"
                required
                class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">اسم المورد أو المصدر (اختياري)</label>
            <input
              type="text"
              v-model="newItemSupplier"
              placeholder="مثال: مطاحن البليدة، موزع معتمد..."
              class="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <div class="flex gap-2 pt-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              حفظ المادة في المخزون
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
