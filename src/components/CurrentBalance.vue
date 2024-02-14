<script async setup lang="ts">
import { useTransactionStore } from "../stores/transaction.store";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
const transactionStore = useTransactionStore();

await transactionStore.getCurrentBalance();
</script>

<template>
  <div class="container">
    <div>
      <h2>Seu saldo Atual: {{ CurrencyFormatter.format(transactionStore.currentBalance) }}</h2>
    </div>
  </div>
</template>
