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
      <h2 :style="(transactionStore.currentBalance >= 0 ? { 'color': 'var(--success)' } : { 'color': 'var(--danger)' })">
        {{
          CurrencyFormatter.format(transactionStore.currentBalance) }}</h2>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 50px;
  border-radius: 10px;
  background-color: white;
  color: var(--info);
}
</style>

