<template>
  <div class="space-y-6 text-right" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <Users class="w-7 h-7 text-pink-500" />
          سجل الزبائن والعلاقات (CRM)
        </h1>
        <p class="text-zinc-400 text-sm mt-1">
          إدارة بيانات زبائن الورشة، سجل المشتريات ومتابعة كبار العملاء في الجزائر
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="exportCustomersCSV"
          class="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-sm font-medium transition-colors"
        >
          <Download class="w-4 h-4 text-zinc-400" />
          تصدير القائمة (CSV)
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 text-sm">إجمالي الزبائن</span>
          <div class="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl">
            <Users class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-white mt-2">{{ store.customers.length }}</div>
        <div class="text-xs text-zinc-500 mt-1">زبائن مسجلين من الطلبيات</div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 text-sm">كبار الزبائن (VIP)</span>
          <div class="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <Award class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-amber-400 mt-2">{{ vipCustomersCount }}</div>
        <div class="text-xs text-zinc-500 mt-1">طلبيتان فأكثر أو أكثر من 20,000 دج</div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 text-sm">إجمالي مبيعات الزبائن</span>
          <div class="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-emerald-400 mt-2">{{ formatPrice(totalCustomerSpent) }} دج</div>
        <div class="text-xs text-zinc-500 mt-1">إجمالي الإيرادات المسجلة</div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 text-sm">متوسط الإنفاق / زبون</span>
          <div class="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <CreditCard class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-black text-blue-400 mt-2">{{ formatPrice(averageBasketDZD) }} دج</div>
        <div class="text-xs text-zinc-500 mt-1">معدل سلة الشراء</div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <Search class="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث بالاسم، رقم الهاتف أو الولاية..."
          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-11 pl-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          @click="activeFilter = 'ALL'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
            activeFilter === 'ALL'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          الكل ({{ store.customers.length }})
        </button>
        <button
          @click="activeFilter = 'VIP'"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5',
            activeFilter === 'VIP'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
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
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          زبائن متكررون ({{ repeatCustomersCount }})
        </button>
      </div>
    </div>

    <!-- Customers List -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div v-if="filteredCustomers.length === 0" class="p-12 text-center text-zinc-500">
        <Users class="w-12 h-12 mx-auto text-zinc-600 mb-3" />
        <p class="text-base font-semibold text-zinc-300">لم يتم العثور على أي زبون</p>
        <p class="text-sm text-zinc-500 mt-1">جرب تغيير كلمات البحث أو الفلاتر المختارة</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead class="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 text-xs font-semibold">
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
          <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
            <tr
              v-for="cust in filteredCustomers"
              :key="cust.id"
              class="hover:bg-zinc-800/40 transition-colors"
            >
              <!-- Name & VIP badge -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 font-bold flex items-center justify-center text-sm border border-pink-500/20 shrink-0">
                    {{ cust.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-white flex items-center gap-2">
                      {{ cust.name }}
                      <span
                        v-if="cust.isVIP"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1"
                      >
                        <Award class="w-3 h-3" />
                        VIP
                      </span>
                    </div>
                    <div class="text-xs text-zinc-500 mt-0.5">معرف: {{ cust.id }}</div>
                  </div>
                </div>
              </td>

              <!-- Phone -->
              <td class="py-4 px-5 font-mono text-zinc-300">
                <span dir="ltr">{{ cust.phone || 'غير مسجل' }}</span>
              </td>

              <!-- Wilaya & Address -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-1.5 text-zinc-200 font-medium">
                  <MapPin class="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{{ cust.wilayaName || ('ولاية ' + cust.wilayaCode) }}</span>
                </div>
                <div class="text-xs text-zinc-500 truncate max-w-[200px] mt-0.5">
                  {{ cust.address || 'العنوان غير محدد' }}
                </div>
              </td>

              <!-- Total Orders -->
              <td class="py-4 px-5">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-200">
                  <ShoppingBag class="w-3 h-3 text-pink-400" />
                  {{ cust.totalOrders }} طلبيات
                </span>
              </td>

              <!-- Total Spent -->
              <td class="py-4 px-5 font-bold text-emerald-400">
                {{ formatPrice(cust.totalSpentDZD) }} دج
              </td>

              <!-- Last Order -->
              <td class="py-4 px-5 text-xs text-zinc-400">
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
                    class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                  >
                    <MessageCircle class="w-4 h-4" />
                  </a>

                  <!-- Phone Call -->
                  <a
                    v-if="cust.phone"
                    :href="'tel:' + cleanPhone(cust.phone)"
                    title="اتصال هاتفي"
                    class="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors"
                  >
                    <Phone class="w-4 h-4" />
                  </a>

                  <!-- Order History Modal trigger -->
                  <button
                    @click="openCustomerHistory(cust)"
                    title="عرض سجل الطلبيات"
                    class="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-colors"
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="selectedCustomer = null"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 text-right space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
          <button
            @click="selectedCustomer = null"
            class="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <User class="w-5 h-5 text-pink-500" />
              سجل طلبيات: {{ selectedCustomer.name }}
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">
              {{ selectedCustomer.phone }} • {{ selectedCustomer.wilayaName }}
            </p>
          </div>
        </div>

        <!-- History Summary -->
        <div class="grid grid-cols-3 gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
          <div class="text-center">
            <span class="text-xs text-zinc-500 block">إجمالي الطلبيات</span>
            <span class="text-lg font-bold text-white">{{ customerOrders.length }}</span>
          </div>
          <div class="text-center border-x border-zinc-800">
            <span class="text-xs text-zinc-500 block">إجمالي الإنفاق</span>
            <span class="text-lg font-bold text-emerald-400">{{ formatPrice(selectedCustomer.totalSpentDZD) }} دج</span>
          </div>
          <div class="text-center">
            <span class="text-xs text-zinc-500 block">حالة العميل</span>
            <span v-if="selectedCustomer.isVIP" class="text-xs font-bold text-amber-400">عميل VIP متميز</span>
            <span v-else class="text-xs font-medium text-zinc-400">زبون نظامي</span>
          </div>
        </div>

        <!-- Orders Table / List -->
        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          <div
            v-for="order in customerOrders"
            :key="order.id"
            class="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white text-sm">طلب #{{ order.orderNumber }}</span>
                <span :class="getStatusBadgeClass(order.status)" class="text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="text-xs text-zinc-400 mt-1">
                {{ order.productName || 'طلب كعكة مخصصة' }}
                <span v-if="order.customization?.servingsCount" class="text-zinc-500">
                  ({{ order.customization.servingsCount }} أفراد)
                </span>
              </div>
              <div class="text-[11px] text-zinc-500 mt-1">
                تاريخ التسليم: {{ formatDate(order.eventDate) }}
              </div>
            </div>

            <div class="text-left font-mono">
              <div class="font-bold text-pink-400">{{ formatPrice(order.totalPriceDZD) }} دج</div>
              <div class="text-[10px] text-zinc-500">{{ getPaymentLabel(order.paymentMethod) }}</div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="selectedCustomer = null"
            class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
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
    PENDING: 'bg-zinc-800 text-zinc-300',
    CONFIRMED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    PREPARING_BASE: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    BAKING_ASSEMBLY: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    DECORATING: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    READY: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    DELIVERING: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    DELIVERED: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20'
  };
  return map[status] || 'bg-zinc-800 text-zinc-300';
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

