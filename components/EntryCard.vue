<template>
  <div v-if="transaction" class="card">
    <p>{{ transaction.id }}</p>
    <p>{{ transaction.name }}</p>
    <p>{{ transaction.value }}</p>
    <p>{{ transaction.transactioTypeId }}</p>
    <p>{{ transaction.date.toLocaleString() }}</p>
    <button @click="deleteEntry">deletar</button>
  </div>
</template>

<script lang="ts" setup>
  import { Transaction } from '~/entities/Transaction'

  const { transaction } = defineProps<{ transaction: Transaction }>()

  const emits = defineEmits<{ deleteEntry: [id: number] }>()

  function deleteEntry() {
    if (transaction.id) emits('deleteEntry', transaction.id)
  }
</script>
