<template>
  <div><h2>Entradas</h2></div>
  <div v-for="entry of transactions">
    <EntryCard :transaction="entry" />
  </div>
</template>
<script setup lang="ts">
  import { TransactionTypes } from '~/enums/TransactionTypes'
  import { transactionRepository } from '~/repositories/TransactionRepository'

  const transactions = await transactionRepository.findMany({
    transaction_type_id: TransactionTypes.INCOME,
  })
</script>
