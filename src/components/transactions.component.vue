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
  <v-container>
    <v-row>
      <v-col col="1">
        <v-card>
          <v-card-title>
            <h2>Receitas</h2>
          </v-card-title>
          <v-card-text>
            <AddTransactionComponent :transactionTypeId="TransactionTypes.INCOME" />
            <TransactionListComponent :transactions="transactionStore.incomes" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col col="1">
        <v-card>
          <v-card-title>
            <h2>Despesas</h2>
          </v-card-title>
          <v-card-text>
            <AddTransactionComponent :transactionTypeId="TransactionTypes.EXPENSE" />
            <TransactionListComponent :transactions="transactionStore.expenses" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
