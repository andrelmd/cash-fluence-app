<template>
  <div>
    <h1>Visão Geral</h1>
    <div>
      <form @submit.prevent="handleInsertEntry">
        <input v-model="newEntry.name" placeholder="Nome" />
        <input v-model="newEntry.value" placeholder="Valor" />
        <select v-model="newEntry.entryTypeId" name="entryTypes">
          <option v-for="entryType of entryTypes" :value="entryType.id">
            {{ entryType.name }}
          </option>
        </select>
        <button @click="handleSave">Adicionar</button>
      </form>
      <div>
        <h2>Entradas</h2>
        <div v-for="entry of positiveEntries" :key="`entry-${entry.id}`">
          <EntryCard :entry="entry" @deleteEntry="handleDelete" />
        </div>
      </div>
      <div>
        <h2>Saídas</h2>
        <div v-for="entry of negativeEntries" :key="`entry-${entry.id}`">
          <EntryCard :entry="entry" @deleteEntry="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { entryRepository } from '@/database/EntryRepository'
  import { entryTypeRepository } from '@/database/EntryTypeRepository'
  import { Entry } from '~/entities/Entry'
  const newEntry = ref<Partial<Entry>>({})
  const entries = ref<Array<Entry>>([])

  const positiveEntries = ref<Array<Entry>>([])
  const negativeEntries = ref<Array<Entry>>([])

  const entryTypes = await entryTypeRepository.getEntryTypes()

  const handleSave = async () => {
    const savedEntry = await entryRepository.save(new Entry(newEntry.value))
    if (savedEntry) entries.value.push(...savedEntry)

    newEntry.value = {}
  }

  const handleDelete = async (entryId: number) => {
    await entryRepository.delete({ id: entryId })
    entries.value = entries.value.filter((it) => it.id !== entryId)
  }

  watch(
    entries,
    (entries) => {
      positiveEntries.value = entries.filter((it) => it.entryTypeId === 1)
      negativeEntries.value = entries.filter((it) => it.entryTypeId === 2)
    },
    { deep: true },
  )

  entries.value = await entryRepository.findMany()
</script>
