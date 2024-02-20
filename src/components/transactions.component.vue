<script async setup lang="ts">
import { ref } from "vue";
import { TransactionTypes } from "../enums/TransactionTypes";
import { useTransactionStore } from "../stores/transaction.store";
import TransactionListComponent from "./transaction-list.component.vue";
import AddTransactionComponent from "./add-transaction.component.vue";

const transactionStore = useTransactionStore();
const page = ref(0);
const limit = ref(999);
await transactionStore.getTransactions(page.value, limit.value);

</script>

<template>
  <div class="container">
    <div class="transactions">
      <h2>Receitas</h2>
      <div>
        <AddTransactionComponent :transactionTypeId="TransactionTypes.INCOME" />

        <TransactionListComponent :transactions="transactionStore.incomes" />
      </div>
    </div>
    <div class="transactions">
      <h2>Despesas</h2>
      <div>
        <AddTransactionComponent :transactionTypeId="TransactionTypes.EXPENSE" />
      </div>
      <TransactionListComponent :transactions="transactionStore.expenses" />
    </div>

  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 50px;
}

.transactions {
  background-color: white;
  color: var(--info);
  border-radius: 10px;
  padding: 50px;
}
</style>

