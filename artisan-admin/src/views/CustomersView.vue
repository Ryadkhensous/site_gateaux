<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Users class="w-7 h-7 text-pink-600" />
          سجل الزبائن والعلاقات (CRM)
        </h1>
        <p class="text-slate-500 text-sm mt-1">
          إدارة بيانات زبائن الورشة، سجل المشتريات ومتابعة كبار العملاء في الجزائر
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="exportCustomersCSV"
          class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium transition-colors"
        >
          <Download class="w-4 h-4 text-slate-500" />
          تصدير القائمة (CSV)
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 text-sm">إجمالي الزبائن</span>
          <div class="p-2.5 bg-pink-50 text-pink-700 rounded-xl">
            <Users class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-slate-900 mt-2">{{ store.customers.length }}</div>
        <div class="text-xs text-slate-400 mt-1">زبائن مسجلين من الطلبيات</div>
      </div>

      <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 text-sm">كبار الزبائن (VIP)</span>
          <div class="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Award class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-amber-700 mt-2">{{ vipCustomersCount }}</div>
        <div class="text-xs text-slate-400 mt-1">طلبيتان فأكثر أو أكثر من 20,000 دج</div>
      </div>

      <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 text-sm">إجمالي مبيعات الزبائن</span>
          <div class="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-emerald-700 mt-2">{{ formatPrice(totalCustomerSpent) }} دج</div>
        <div class="text-xs text-slate-400 mt-1">إجمالي الإيرادات المسجلة</div>
      </div>

      <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-500 text-sm">متوسط الإنفاق / زبون</span>
          <div class="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <CreditCard class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-blue-700 mt-2">{{ formatPrice(averageBasketDZD) }} دج</div>
        <div class="text-xs text-slate-400 mt-1">معدل سلة الشراء</div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
      <div class="relative w-full md:w-96">
        <Search class="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث بالاسم، رقم الهاتف أو الولاية..."
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pr-11 pl-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          @click="activeFilter = 'ALL'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            activeFilter === 'ALL'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          ]"
        >
          الكل ({{ store.customers.length }})
        </button>
        <button
          @click="activeFilter = 'VIP'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5',
            activeFilter === 'VIP'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-400/30'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          ]"
        >
          <Award class="w-3.5 h-3.5" />
          كبار الزبائن VIP ({{ vipCustomersCount }})
        </button>
        <button
          @click="activeFilter = 'REPEAT'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            activeFilter === 'REPEAT'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          ]"
        >
          زبائن متكررون ({{ repeatCustomersCount }})
        </button>
      </div>
    </div>

    <!-- Customers List -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div v-if="filteredCustomers.length === 0" class="p-12 text-center text-slate-500">
        <Users class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p class="text-base font-semibold text-slate-700">لم يتم العثور على أي زبون</p>
        <p class="text-sm text-slate-400 mt-1">جرب تغيير كلمات البحث أو الفلاتر المختارة</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
            <tr>
              <th class="py-4 px-5">الزبون</th>
              <th class="py-4 px-5">رقم الهاتف</th>
              <th class="py-4 px-5">الولاية والعنوان</th>
              <th class="py-4 px-5">الطلبيات</th>
              <th class="py-4 px-5">إجمالي المشتريات</th>
              <th class="py-4 px-5">آخر طلبية</th>
              <th class="py-4 px-5 text-center">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr
              v-for="cust in filteredCustomers"
              :key="cust.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Name & VIP badge -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-sm border border-pink-200 shrink-0">
                    {{ cust.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 flex items-center gap-2">
                      {{ cust.name }}
                      <span
                        v-if="cust.isVIP"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"
                      >
                        <Award class="w-3 h-3" />
                        VIP
                      </span>
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">معرف: {{ cust.id }}</div>
                  </div>
                </div>
              </td>

              <!-- Phone -->
              <td class="py-4 px-5 font-mono text-slate-700">
                <span dir="ltr">{{ cust.phone || 'غير مسجل' }}</span>
              </td>

              <!-- Wilaya & Address -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-1.5 text-slate-800 font-medium">
                  <MapPin class="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>{{ cust.wilayaName || ('ولاية ' + cust.wilayaCode) }}</span>
                </div>
                <div class="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                  {{ cust.address || 'العنوان غير محدد' }}
                </div>
              </td>

              <!-- Total Orders -->
              <td class="py-4 px-5">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                  <ShoppingBag class="w-3 h-3 text-pink-600" />
                  {{ cust.totalOrders }} طلبيات
                </span>
              </td>

              <!-- Total Spent -->
              <td class="py-4 px-5 font-bold text-emerald-700">
                {{ formatPrice(cust.totalSpentDZD) }} دج
              </td>

              <!-- Last Order -->
              <td class="py-4 px-5 text-xs text-slate-500">
                {{ formatDate(cust.lastOrderDate) }}
              </td>

              <!-- Actions -->
              <td class="py-4 px-5">
                <div class="flex items-center justify-center gap-2">
                  <!-- WhatsApp -->
                  <a
                    v-if="cust.phone"
                    :href="getWhatsAppLink(cust)"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="مراسلة عبر واتساب"
                    class="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <MessageCircle class="w-4 h-4" />
                  </a>

                  <!-- Phone Call -->
                  <a
                    v-if="cust.phone"
                    :href="'tel:' + cleanPhone(cust.phone)"
                    title="اتصال هاتفي"
                    class="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <Phone class="w-4 h-4" />
                  </a>

                  <!-- Order History Modal trigger -->
                  <button
                    @click="openCustomerHistory(cust)"
                    title="عرض سجل الطلبيات"
                    class="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer History Modal -->
    <div
      v-if="selectedCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="selectedCustomer = null"
    >
      <div class="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 text-right space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            @click="selectedCustomer = null"
            class="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User class="w-5 h-5 text-pink-600" />
              سجل طلبيات: {{ selectedCustomer.name }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ selectedCustomer.phone }} • {{ selectedCustomer.wilayaName }}
            </p>
          </div>
        </div>

        <!-- History Summary -->
        <div class="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div class="text-center">
            <span class="text-xs text-slate-500 block">إجمالي الطلبيات</span>
            <span class="text-lg font-bold text-slate-900">{{ customerOrders.length }}</span>
          </div>
          <div class="text-center border-x border-slate-200">
            <span class="text-xs text-slate-500 block">إجمالي الإنفاق</span>
            <span class="text-lg font-bold text-emerald-700">{{ formatPrice(selectedCustomer.totalSpentDZD) }} دج</span>
          </div>
          <div class="text-center">
            <span class="text-xs text-slate-500 block">حالة العميل</span>
            <span v-if="selectedCustomer.isVIP" class="text-xs font-bold text-amber-700">عميل VIP متميز</span>
            <span v-else class="text-xs font-medium text-slate-500">زبون نظامي</span>
          </div>
        </div>

        <!-- Orders Table / List -->
        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          <div
            v-for="order in customerOrders"
            :key="order.id"
            class="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm">طلب #{{ order.orderNumber }}</span>
                <span :class="getStatusBadgeClass(order.status)" class="text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="text-xs text-slate-600 mt-1">
                {{ order.productName || 'طلب كعكة مخصصة' }}
                <span v-if="order.customization?.servingsCount" class="text-slate-400">
                  ({{ order.customization.servingsCount }} أفراد)
                </span>
              </div>
              <div class="text-[11px] text-slate-400 mt-1">
                تاريخ التسليم: {{ formatDate(order.eventDate) }}
              </div>
            </div>

            <div class="text-left font-mono">
              <div class="font-bold text-pink-600">{{ formatPrice(order.totalPriceDZD) }} دج</div>
              <div class="text-[10px] text-slate-500">{{ getPaymentLabel(order.paymentMethod) }}</div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="selectedCustomer = null"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { CustomerItem, OrderItem } from '../types';
import {
  Users,
  Search,
  Award,
  TrendingUp,
  CreditCard,
  MapPin,
  ShoppingBag,
  MessageCircle,
  Phone,
  Eye,
  Download,
  X,
  User
} from 'lucide-vue-next';

const store = useOrderStore();
const searchQuery = ref('');
const activeFilter = ref<'ALL' | 'VIP' | 'REPEAT'>('ALL');
const selectedCustomer = ref<CustomerItem | null>(null);

const vipCustomersCount = computed(() => {
  return store.customers.filter((c) => c.isVIP).length;
});

const repeatCustomersCount = computed(() => {
  return store.customers.filter((c) => c.totalOrders > 1).length;
});

const totalCustomerSpent = computed(() => {
  return store.customers.reduce((sum, c) => sum + c.totalSpentDZD, 0);
});

const averageBasketDZD = computed(() => {
  if (store.customers.length === 0) return 0;
  return Math.round(totalCustomerSpent.value / store.customers.length);
});

const filteredCustomers = computed(() => {
  return store.customers.filter((cust) => {
    // Search match
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      cust.name.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      (cust.wilayaName && cust.wilayaName.toLowerCase().includes(q));

    // Tab filter
    if (!matchesSearch) return false;
    if (activeFilter.value === 'VIP') return cust.isVIP;
    if (activeFilter.value === 'REPEAT') return cust.totalOrders > 1;
    return true;
  });
});

const customerOrders = computed<OrderItem[]>(() => {
  if (!selectedCustomer.value) return [];
  const phone = selectedCustomer.value.phone;
  const name = selectedCustomer.value.name;
  return store.orders.filter((o) => {
    return (phone && o.customerPhone === phone) || o.customerName === name;
  });
});

function openCustomerHistory(customer: CustomerItem) {
  selectedCustomer.value = customer;
}

function cleanPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

function getWhatsAppLink(cust: CustomerItem): string {
  let p = cleanPhone(cust.phone);
  if (p.startsWith('0')) {
    p = '213' + p.substring(1);
  } else if (!p.startsWith('213') && !p.startsWith('+213')) {
    p = '213' + p;
  }
  p = p.replace('+', '');
  const msg = encodeURIComponent(`السلام عليكم ${cust.name}، نتواصل معك من ورشة ${store.settings.storeName} بخصوص طلبيتك.`);
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

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'قيد المراجعة',
    CONFIRMED: 'مؤكدة',
    PREPARING_BASE: 'تحضير القاعدة',
    BAKING_ASSEMBLY: 'الخبز والتركيب',
    DECORATING: 'التزيين واللمسات',
    READY: 'جاهزة للاستلام',
    DELIVERING: 'قيد التوصيل',
    DELIVERED: 'تم التسليم',
    CANCELLED: 'ملغاة'
  };
  return map[status] || status;
}

function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'bg-slate-100 text-slate-700',
    CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-200',
    PREPARING_BASE: 'bg-amber-50 text-amber-800 border border-amber-200',
    BAKING_ASSEMBLY: 'bg-amber-50 text-amber-800 border border-amber-200',
    DECORATING: 'bg-pink-50 text-pink-700 border border-pink-200',
    READY: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    DELIVERING: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    CANCELLED: 'bg-red-50 text-red-700 border border-red-200'
  };
  return map[status] || 'bg-slate-100 text-slate-700';
}

function getPaymentLabel(method: string): string {
  const map: Record<string, string> = {
    CASH_ON_DELIVERY: 'دفع عند الاستلام',
    CIB_EDAHABIA: 'بريدي موب / CIB',
    BANK_TRANSFER: 'تحويل بنكي'
  };
  return map[method] || method;
}

function exportCustomersCSV() {
  const headers = ['الاسم', 'رقم الهاتف', 'الولاية', 'العنوان', 'عدد الطلبيات', 'إجمالي الإنفاق (دج)', 'تاريخ آخر طلبية', 'عميل VIP'];
  const rows = store.customers.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${c.wilayaName || c.wilayaCode}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    c.totalOrders,
    c.totalSpentDZD,
    `"${c.lastOrderDate}"`,
    c.isVIP ? 'نعم' : 'لا'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sweetbox_customers_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
