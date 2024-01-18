<script async setup lang="ts">
import { ref } from "vue";
import Logger from "../helpers/Logger";
import { databaseManager } from "../configurations/DatabaseManager";
import { TransactionTypes } from "../enums/TransactionTypes";
import AddTransaction from "./AddTransaction.vue";
import { TransactionClass } from "../classes/Transaction";
import { typesIdByTitle } from "../helpers/TypesIdByTitle";
import Transaction from "./Transaction.vue";
import { TransactionModel } from "../models/TransactionModel";

const incomes = ref(new Array<TransactionClass>());
const expenses = ref(new Array<TransactionClass>());

const getIncomes = async () => {
  try {
    const incomeEntities = await databaseManager.getTransactions({
      where: { type_id: typesIdByTitle.get(TransactionTypes.INCOME) },
    });
    return incomeEntities.map((it) => new TransactionClass(it));
  } catch (error) {
    Logger.error(`Transactions.vue - getIncomes() - error: ${error}`);
    throw error;
  }
};
const getExpenses = async () => {
  try {
    const expenseEntities = await databaseManager.getTransactions({
      where: { type_id: typesIdByTitle.get(TransactionTypes.EXPENSE) },
    });
    return expenseEntities.map((it) => new TransactionClass(it));
  } catch (error) {
    Logger.error(`Transactions.vue - getExpenses() - error: ${error}`);
    throw error;
  }
};

try {
  Logger.debug("Transactions.vue - setup() - init");
  incomes.value = await getIncomes();
  expenses.value = await getExpenses();

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
  incomes.value = await getIncomes();
  expenses.value = await getExpenses();
};

const onTransactionDeleted = async () => {
  incomes.value = await getIncomes();
  expenses.value = await getExpenses();
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
        :transactionTypeId="typesIdByTitle.get(TransactionTypes.INCOME)!"
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
            :transactionModel="new TransactionModel(income)"
            :onTransactionDeleted="onTransactionDeleted"
          />
        </tbody>
      </table>
    </div>
    <h2>Despesas</h2>
    <div>
      <AddTransaction
        :transactionTypeId="typesIdByTitle.get(TransactionTypes.EXPENSE)!"
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
          :transactionModel="new TransactionModel(expense)"
          :onTransactionDeleted="onTransactionDeleted"
        />
      </tbody>
    </table>
  </div>
</template>
