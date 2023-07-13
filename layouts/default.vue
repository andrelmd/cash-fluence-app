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

<script setup lang="ts">
  import { open } from '@tauri-apps/api/dialog'
  import { exists, readTextFile } from '@tauri-apps/api/fs'

  const openFile = () =>
    useState('openFile', async () => {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: '.csv',
            extensions: ['csv'],
          },
        ],
      })
      if (selected && typeof selected === 'string') {
        if (await exists(selected)) {
          const readFile = await readTextFile(selected)
          // const object = parse(readFile, {
          //   columns: true,
          //   skip_empty_lines: true,
          //   cast: true,
          // });
          // console.log(object);
        }
      }
    })
</script>

<style scoped>
  .router-link-exact-active {
    color: #12b488;
  }
</style>
