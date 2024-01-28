<script async setup lang="ts">
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import Logger from "../helpers/Logger";
import { TransactionEntity } from "../domain/entity/transaction.entity";
import { transactionPluginAdapter } from "../infrastruct/adapter/plugin/transaction/transaction-plugin.adapter";
import { RemoveTransactionUseCase } from "../domain/usecases/transaction/remove-transaction.use-case.ts";
import { GetCategoryByIdUseCase } from "../domain/usecases/category/get-category-by-id.use-case.ts";
import { categoryPluginAdapter } from "../infrastruct/adapter/plugin/category-plugin.adapter.ts";
const componentLogPrefix = "Transaction.vue -";
const props = defineProps<{
  transaction: TransactionEntity;
  onTransactionDeleted: (transaction: TransactionEntity) => void;
}>();

const getCategoryByIdUseCase = new GetCategoryByIdUseCase(
  categoryPluginAdapter,
);

const category = await getCategoryByIdUseCase.execute(props.transaction.id);
const deleteTransaction = async () => {
  const logPrefix = `${componentLogPrefix} deleteTransaction() -`;
  Logger.info(
    `${logPrefix} deleting transaction ${JSON.stringify(props.transaction)}`,
  );
  try {
    const removeTransactionUseCase = new RemoveTransactionUseCase(
      transactionPluginAdapter,
    );
    await removeTransactionUseCase.execute(props.transaction.id);

    Logger.info(
      `${logPrefix} transaction ${JSON.stringify(props.transaction)} deleted`,
    );
    props.onTransactionDeleted(props.transaction);
  } catch (error) {}
};
</script>

<template>
  <tr>
    <td>{{ transaction.title }}</td>
    <td>{{ CurrencyFormatter.format(transaction.value) }}</td>
    <td>{{ transaction.date.toLocaleDateString() }}</td>
    <td>{{ category.id }}</td>

    <td>
      <button type="button" class="btn btn-danger" @click="deleteTransaction">
        Excluir
      </button>
    </td>
  </tr>
</template>
