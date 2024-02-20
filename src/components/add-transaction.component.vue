<script async setup lang="ts">
import { ref } from 'vue';
import { TransactionEntity } from '../domain/entity/transaction.entity';
import Logger from '../helpers/Logger';
import { useCategoryStore } from '../stores/category.store';
import { useTransactionStore } from '../stores/transaction.store';
const props = defineProps<{
  transactionTypeId: number;
}>();

const transactionTitle = ref("");
const transactionAmount = ref(0);
const transactionDate = ref('');
const transactionTypeId = ref(props.transactionTypeId);
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const transactionCategoryId = ref(0);

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
    <div class="input-row">
      <div>
        <label for="title">Título</label>
        <input class="input-default" type="text" id="title" placeholder="Título" v-model="transactionTitle" />
      </div>
      <div>
        <label for="amount">Valor</label>
        <input class="input-default" type="number" id="amount" placeholder="Valor" v-model="transactionAmount" />
      </div>
      <div>
        <label for="date">Data</label>
        <input class="input-default" type="date" id="date" placeholder="Data" v-model="transactionDate" />
      </div>
      <div>
        <label for="category">Categoria</label>
        <select class="select-default" id="category" v-model="transactionCategoryId">
          <option v-for="category of categoryStore.categories" :value="category.id">
            {{ category.title }}
          </option>
        </select>
      </div>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="!transactionTitle ||
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
}

.input-row {
  display: flex;
  flex-direction: row;
}

.input-row div {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}

label {
  float: left;
  margin-right: 20px;  
}

input {
  float:left;
}

button {
  margin: 10px;
}
</style>


