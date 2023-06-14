<template>
  <div>
    <header class="shadow-sm bg-white">
      <nav class="container mx-auto p-4 flex justify-between">
        <ul class="flex gap-4">
          <li><NuxtLink to="/" class="btn">Visão Geral</NuxtLink></li>
          <li><NuxtLink to="/entries/in" class="btn">Entradas</NuxtLink></li>
          <li><NuxtLink to="/entries/out" class="btn">Saídas</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <div class="container mx-auto p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.router-link-exact-active {
  color: #12b488;
}
</style>
