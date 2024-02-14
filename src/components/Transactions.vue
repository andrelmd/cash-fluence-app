<script async setup lang="ts">
import { ref } from "vue";
import { TransactionTypes } from "../enums/TransactionTypes";
import { useTransactionStore } from "../stores/transaction.store";
import AddTransaction from "./AddTransaction.vue";
import Transaction from "./Transaction.vue";

const transactionStore = useTransactionStore();
const page = ref(0);
const limit = ref(999);
await transactionStore.getTransactions(page.value, limit.value);

</script>

<template>
  <div class="container">
    <h2>Receitas</h2>
    <div>
      <AddTransaction :transactionTypeId="TransactionTypes.INCOME" />
      <table>
        <thead>
          <th>Titulo</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Categoria</th>
        </thead>
        <tbody v-for="income in transactionStore.incomes" :key="income.id">
          <Transaction :transaction="income" />
        </tbody>
      </table>
    </div>
    <h2>Despesas</h2>
    <div>
      <AddTransaction :transactionTypeId="TransactionTypes.EXPENSE" />
    </div>
    <table>
      <thead>
        <th>Titulo</th>
        <th>Valor</th>
        <th>Data</th>
        <th>Categoria</th>
      </thead>
      <tbody v-for="expense in  transactionStore.expenses" :key="expense.id">
        <Transaction :transaction="expense" />
      </tbody>
    </table>
  </div>
</template>
