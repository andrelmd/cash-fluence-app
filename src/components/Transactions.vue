<script async setup lang="ts">
import { ref } from "vue";
import Logger from "../helpers/Logger";
import { TransactionTypes } from "../enums/TransactionTypes";
import AddTransaction from "./AddTransaction.vue";
import Transaction from "./Transaction.vue";
import { GetIncomeTransactionsUseCase } from "../domain/usecases/transaction/get-income-transactions.use-case.ts";
import { GetExpenseTransactionUseCase } from "../domain/usecases/transaction/get-expense-transactions.use-case.ts";
import { transactionPluginAdapter } from "../infrastruct/adapter/plugin/transaction/transaction-plugin.adapter";
import { TransactionEntity } from "../domain/entity/transaction.entity";

const getIncomeTransactionsUseCase = new GetIncomeTransactionsUseCase(
  transactionPluginAdapter,
);
const getExpenseTransactionUseCase = new GetExpenseTransactionUseCase(
  transactionPluginAdapter,
);
const incomes = ref(new Array<TransactionEntity>());
const expenses = ref(new Array<TransactionEntity>());

try {
  Logger.debug("Transactions.vue - setup() - init");
  incomes.value = await getIncomeTransactionsUseCase.execute();
  expenses.value = await getExpenseTransactionUseCase.execute();

  Logger.debug(
    `Transactions.vue - setup() - init - incomes: ${JSON.stringify(
      incomes.value,
    )}`,
  );
  Logger.debug(
    `Transactions.vue - setup() - init - expenses: ${JSON.stringify(
      expenses.value,
    )}`,
  );
} catch (error) {
  Logger.error(`Transactions.vue - setup() - error: ${error}`);
}

const onTransactionAdded = async () => {
  incomes.value = await getIncomeTransactionsUseCase.execute();
  expenses.value = await getExpenseTransactionUseCase.execute();
};

const onTransactionDeleted = async () => {
  incomes.value = await getIncomeTransactionsUseCase.execute();
  expenses.value = await getExpenseTransactionUseCase.execute();
};

try {
  await onTransactionAdded();
} catch (error) {
  Logger.error(`Transactions.vue - onTransactionAdded() - error: ${error}`);
}
</script>

<template>
  <div class="container">
    <h2>Receitas</h2>
    <div>
      <AddTransaction
        :transactionTypeId="TransactionTypes.INCOME"
        :onTransactionAdded="onTransactionAdded"
      />
      <table>
        <thead>
          <th>Titulo</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Categoria</th>
        </thead>
        <tbody v-for="income in incomes" :key="income.id">
          <Transaction
            :transaction="income"
            :onTransactionDeleted="onTransactionDeleted"
          />
        </tbody>
      </table>
    </div>
    <h2>Despesas</h2>
    <div>
      <AddTransaction
        :transactionTypeId="TransactionTypes.EXPENSE"
        :onTransactionAdded="onTransactionAdded"
      />
    </div>
    <table>
      <thead>
        <th>Titulo</th>
        <th>Valor</th>
        <th>Data</th>
        <th>Categoria</th>
      </thead>
      <tbody v-for="expense in expenses" :key="expense.id">
        <Transaction
          :transaction="expense"
          :onTransactionDeleted="onTransactionDeleted"
        />
      </tbody>
    </table>
  </div>
</template>
