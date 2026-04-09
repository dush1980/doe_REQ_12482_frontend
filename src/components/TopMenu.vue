<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand bg-white border-bottom shadow-sm">
    <div class="container">
      <span class="navbar-brand mb-0 h1">Dushmantha Walakulpola - REQ12482</span>
      <div class="navbar-nav gap-2">
        <RouterLink class="btn btn-outline-primary" to="/map">Map</RouterLink>
        <RouterLink class="btn btn-outline-primary" to="/list">List</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  color: #fff !important;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
