<script async setup lang="ts">
import { ref } from "vue";
import { databaseManager } from "../configurations/DatabaseManager";
import Logger from "../helpers/Logger";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionClass } from "../classes/Transaction";
import { categories } from "../helpers/Categories";

const props = defineProps<{
  transactionTypeId: number;
  onTransactionAdded: () => void;
}>();

const newTransaction = ref(
  new TransactionClass({
    typeId: props.transactionTypeId,
  }),
);

const saveTransaction = async () => {
  Logger.debug(
    `AddTransaction.vue - saveTransaction() - newTransactionModel: ${JSON.stringify(
      newTransaction.value,
    )}`,
  );
  try {
    await databaseManager.saveTransaction(
      new TransactionModel(newTransaction.value),
    );
    props.onTransactionAdded();
  } catch (error) {
    Logger.error(`AddTransaction.vue - saveTransaction() - error: ${error}`);
  }
};
</script>

<template>
  <form @submit.prevent="saveTransaction">
    <div>
      <label for="title">Título</label>
      <input
        type="text"
        id="title"
        placeholder="Título"
        v-model="newTransaction.title"
      />
    </div>
    <div>
      <label for="value">Valor</label>
      <input
        type="number"
        id="value"
        placeholder="Valor"
        v-model="newTransaction.value"
      />
    </div>
    <div>
      <label for="date">Data</label>
      <input
        type="date"
        id="date"
        placeholder="Data"
        v-model="newTransaction.date"
      />
    </div>
    <div>
      <select v-model="newTransaction.categoryId">
        <option v-for="category of categories.values()" :value="category.id">
          {{ category.title }}
        </option>
      </select>
    </div>
    <button
      type="submit"
      :disabled="
        !newTransaction.title ||
        !newTransaction.value ||
        !newTransaction.date ||
        !newTransaction.categoryId
      "
    >
      Salvar
    </button>
  </form>
</template>
