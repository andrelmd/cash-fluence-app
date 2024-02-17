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
    <div class="income-container">
      <h2>Receitas</h2>
      <div>
        <AddTransaction :transactionTypeId="TransactionTypes.INCOME" />
        <table>
          <thead>
            <th>Titulo</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Categoria</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="income, index in transactionStore.incomes" :key="income.id"
              :class="index % 2 === 0 ? 'row-even' : 'row-odd'">
              <Transaction :transaction="income" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="expense-container">
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
          <th></th>
        </thead>
        <tbody>
          <tr v-for="expense in transactionStore.expenses" :key="expense.id">
            <Transaction :transaction="expense" />
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 75%;
  justify-content: space-around;
  padding: 50px 20px;
  border-radius: 5px;
}

.income-container {
  border-radius: 8px;
  background-color: white;
  border: 2px solid var(--info);
  width: 50%;
  margin: 10px 10px;
}

.income-container h2 {
  color: var(--info);
  text-align: center;
}

.expense-container {
  border-radius: 8px;
  background-color: white;
  border: 2px solid var(--info);
  width: 50%;
  margin: 10px 10px;
}

.expense-container h2 {
  color: var(--info);
  text-align: center;
}

table {
  width: 100%;
  border-radius: 10px;
  border-collapse: collapse;
}

th {
  color: var(--info);
  padding: 10px;
  text-align: center;
  width: 100%;
}

tr {
  border-bottom: 1px solid lightgray;
}


</style>
