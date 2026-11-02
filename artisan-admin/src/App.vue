<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from './stores/orderStore';
import Sidebar from './components/Sidebar.vue';
import OrdersView from './views/OrdersView.vue';
import ShowcaseView from './views/ShowcaseView.vue';
import AnalyticsView from './views/AnalyticsView.vue';

const currentView = ref('orders');
const store = useOrderStore();

onMounted(async () => {
  await store.init();
});
</script>

<template>
  <div class="flex h-screen bg-stone-100 overflow-hidden">
    <!-- Sidebar Left -->
    <Sidebar :currentView="currentView" @change-view="currentView = $event" />

    <!-- Main Content Right -->
    <main class="flex-1 overflow-y-auto p-6 sm:p-8">
      <div class="max-w-7xl mx-auto">
        <OrdersView v-if="currentView === 'orders'" />
        <ShowcaseView v-if="currentView === 'showcase'" />
        <AnalyticsView v-if="currentView === 'analytics'" />
      </div>
    </main>
  </div>
</template>

