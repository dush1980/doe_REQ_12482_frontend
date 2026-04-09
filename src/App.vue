<script setup>
import { RouterView } from 'vue-router'
import TopMenu from './components/TopMenu.vue'
</script>

<template>
  <div class="app-shell">
    <TopMenu />
    <main class="container py-3">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f8f9fa;
}
</style>
