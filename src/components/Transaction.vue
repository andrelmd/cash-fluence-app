<script async setup lang="ts">
import { TransactionModel } from "../models/TransactionModel";
import { categories } from "../helpers/Categories";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import { databaseManager } from "../configurations/DatabaseManager";
import Logger from "../helpers/Logger";

const props = defineProps<{
  transactionModel: TransactionModel;
  onTransactionDeleted: () => void;
}>();

const deleteTransaction = async () => {
  Logger.debug(
    `Transaction.vue - deleteTransaction() - init: ${JSON.stringify(
      props.transactionModel,
    )}`,
  );
  if (!props.transactionModel.id) return;

  await databaseManager.deleteTransaction(props.transactionModel.id);

  props.onTransactionDeleted();
};
</script>

<template>
  <tr>
    <td>{{ transactionModel.title }}</td>
    <td>{{ CurrencyFormatter.format(transactionModel.value) }}</td>
    <td>{{ new Date(transactionModel.date).toLocaleDateString() }}</td>
    <td>{{ categories.get(transactionModel.category_id)?.title }}</td>

    <td>
      <button type="button" class="btn btn-danger" @click="deleteTransaction">
        Excluir
      </button>
    </td>
  </tr>
</template>
