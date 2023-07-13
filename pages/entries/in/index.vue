<template>
  {{ entries }}
  <div><h2>Entradas</h2></div>
  <div v-for="entry of entries">
    <EntryCard :entry="entry" />
  </div>
</template>
<script setup lang="ts">
  import { entryRepository } from '~/database/EntryRepository'

  const entries = await entryRepository.findMany({ entry_type_id: 1 })
</script>
