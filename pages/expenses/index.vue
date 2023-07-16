<template>
  <div>
    <h2>Saídas</h2>
    <div v-for="transaction of transactions">
      <EntryCard :transaction="transaction" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { TransactionTypes } from '~/enums/TransactionTypes'
  import { transactionRepository } from '~/repositories/TransactionRepository'

  const transactions = await transactionRepository.findMany({
    transaction_type_id: TransactionTypes.EXPENSE,
  })
</script>
