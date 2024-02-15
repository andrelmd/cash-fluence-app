<script async setup lang="ts">
import { useTransactionStore } from "../stores/transaction.store";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
const transactionStore = useTransactionStore();

await transactionStore.getCurrentBalance();
</script>

<template>
  <div class="container">
    <div>
      <h2>Seu saldo Atual</h2>
      <h3 :style="(transactionStore.currentBalance >= 0 ? { 'color': 'var(--success)' } : { 'color': 'var(--danger)' })">{{
        CurrencyFormatter.format(transactionStore.currentBalance) }}</h3>
    </div>
  </div>
</template>

<style scoped>
h3 {
  font-weight: bold;
  text-align: center;
  margin: 0px 0px 10px 0px;
}

h2 {
  color: var(--info);
  text-align: center;
  margin: 10px 0px 0px 0px;
}
</style>
