<template>
  <div v-if="entry" class="card">
    <p>{{ entry.id }}</p>
    <p>{{ entry.name }}</p>
    <p>{{ entry.value }}</p>
    <p>{{ entry.entryTypeId }}</p>
    <p>{{ entry.createdAt.toLocaleString() }}</p>
    <button @click="deleteEntry">deletar</button>
  </div>
</template>

<script lang="ts" setup>
  import { Entry } from '@/entities/Entry'
  const { entry } = defineProps<{ entry: Entry }>()

  const emits = defineEmits<{ deleteEntry: [id: number] }>()

  function deleteEntry() {
    if (entry.id) emits('deleteEntry', entry.id)
  }
</script>
