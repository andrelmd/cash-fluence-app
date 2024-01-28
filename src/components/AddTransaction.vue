<script async setup lang="ts">
import { ref } from "vue";
import Logger from "../helpers/Logger";
import { TransactionEntity } from "../domain/entity/transaction.entity";
import { AddTransactionUseCase } from "../domain/usecases/transaction/add-transaction.use-case";
import { transactionPluginAdapter } from "../infrastruct/adapter/plugin/transaction/transaction-plugin.adapter";
import { CategoryEntity } from "../domain/entity/category.entity";
import { categoryPluginAdapter } from "../infrastruct/adapter/plugin/category-plugin.adapter";
import { GetAllCategoriesUseCase } from "../domain/usecases/category/get-all-categories.use-case";

const componentLogPrefix = "AddTransaction.vue -";
const props = defineProps<{
  transactionTypeId: number;
  onTransactionAdded: () => void;
}>();

const newTransaction = ref(
  new TransactionEntity({
    typeId: props.transactionTypeId,
  }),
);

const categories = ref(new Array<CategoryEntity>());

try {
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
    categoryPluginAdapter,
  );
  categories.value = await getAllCategoriesUseCase.execute();
} catch (error) {
  throw error;
}

const saveTransaction = async () => {
  const logPrefix = `${componentLogPrefix} saveTransaction() -`;
  const addTransactionUseCase = new AddTransactionUseCase(
    transactionPluginAdapter,
  );
  try {
    Logger.info(
      `${logPrefix} Adding transaction ${JSON.stringify(newTransaction.value)}`,
    );
    newTransaction.value = await addTransactionUseCase.execute(
      newTransaction.value,
    );
    Logger.info(
      `${logPrefix} transaction ${JSON.stringify(newTransaction.value)} added`,
    );
  } catch (error) {
    Logger.info(`${logPrefix} Error while adding transaction: ${error}`);
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
