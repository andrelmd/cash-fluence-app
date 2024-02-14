<script async setup lang="ts">
import { ref } from 'vue';
import { TransactionEntity } from '../domain/entity/transaction.entity';
import { useCategoryStore } from '../stores/category.store';
import { useTransactionStore } from '../stores/transaction.store';
const props = defineProps<{
  transactionTypeId: number;
}>();

const transactionTitle = ref("");
const transactionAmount = ref(0);
const transactionDate = ref(new Date());
const transactionCategoryId = ref(1);
const transactionTypeId = ref(props.transactionTypeId);
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const saveTransaction = async () => {
  await transactionStore.addTransaction(new TransactionEntity({
    title: transactionTitle.value,
    amount: transactionAmount.value,
    date: transactionDate.value,
    categoryId: transactionCategoryId.value,
    typeId: transactionTypeId.value,
  }));
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
    <button type="submit" :disabled="!transactionTitle ||
      !transactionAmount ||
      !transactionDate ||
      !transactionCategoryId
      ">
      Salvar
    </button>
  </form>
</template>
