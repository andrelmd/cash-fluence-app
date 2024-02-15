<script async setup lang="ts">
import { ref } from 'vue';
import { TransactionEntity } from '../domain/entity/transaction.entity';
import { useCategoryStore } from '../stores/category.store';
import { useTransactionStore } from '../stores/transaction.store';
import Logger from '../helpers/Logger';
const props = defineProps<{
  transactionTypeId: number;
}>();

const transactionTitle = ref("");
const transactionAmount = ref(0);
const transactionDate = ref('');
const transactionCategoryId = ref(1);
const transactionTypeId = ref(props.transactionTypeId);
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const saveTransaction = async () => {
  Logger.debug("Saving transaction");
  try {
    await transactionStore.addTransaction(new TransactionEntity({
      title: transactionTitle.value,
      amount: transactionAmount.value,
      date: new Date(transactionDate.value),
      categoryId: transactionCategoryId.value,
      typeId: transactionTypeId.value,
    }));

  } catch (error) {
    console.error(error);
  }
};

</script>

<template>
  <form @submit.prevent="saveTransaction">
    <div>
      <label for="title">Título</label>
      <input type="text" id="title" placeholder="Título" v-model="transactionTitle" />
    </div>
    <div>
      <label for="value">Valor</label>
      <input type="number" id="amount" placeholder="Valor" v-model="transactionAmount" />
    </div>
    <div>
      <label for="date">Data</label>
      <input type="date" id="date" placeholder="Data" v-model="transactionDate" />
    </div>
    <div>
      <select v-model="transactionCategoryId">
        <option v-for="category of categoryStore.categories" :value="category.id">
          {{ category.title }}
        </option>
      </select>
    </div>
    <button class="btn" type="submit" :disabled="!transactionTitle ||
      !transactionAmount ||
      !transactionDate ||
      !transactionCategoryId
      ">
      Salvar
    </button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--info);
  color: var(--info);
  margin: 10px;
}
</style>
