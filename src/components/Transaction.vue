<script async setup lang="ts">
import { TransactionEntity } from "../domain/entity/transaction.entity";
import { useCategoryStore } from "../stores/category.store";
import { useTransactionStore } from "../stores/transaction.store";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
const props = defineProps<{
  transaction: TransactionEntity;
}>();

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const deleteTransaction = async () => {
  await transactionStore.removeTransaction(props.transaction.id);
};


</script>

<template>
  <tr>
    <td>{{ transaction.title }}</td>
    <td>{{ CurrencyFormatter.format(transaction.amount) }}</td>
    <td>{{ `${transaction.date.getDate().toString().padStart(2, '0')}/${(transaction.date.getMonth()
      + 1).toString().padStart(2,
        '0')}/${transaction.date.getFullYear()}` }}
    </td>
    <td>{{ categoryStore.categories.find(it => it.id === transaction.categoryId)?.title }}</td>

    <td>
      <button type="button" class="btn btn-danger" @click="deleteTransaction">
        Excluir
      </button>
    </td>
  </tr>
</template>


<style scoped></style>