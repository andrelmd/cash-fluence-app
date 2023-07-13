<template>
  <div>
    <h2>Saídas</h2>
    <div v-for="entry of entries">
      <EntryCard :entry="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { entryRepository } from '~/database/EntryRepository'

  const entries = await entryRepository.findMany({ entry_type_id: 2 })
</script>
