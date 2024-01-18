<script async setup lang="ts">
import { ref } from "vue";
import { databaseManager } from "../configurations/DatabaseManager";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import Logger from "../helpers/Logger";

const sumTransactionsSQL = `
  SELECT SUM(CASE WHEN t.type_id = out_type.id THEN -t.value ELSE t.value END) as total_value
  FROM transactions t
  JOIN types out_type ON out_type.title = 'Saída';
`;
const currentBalance = ref<number>(0);
try {
  const result = await databaseManager.selectOne<{ total_value: number }>(
    sumTransactionsSQL,
  );

  if (result.total_value !== null) currentBalance.value = result.total_value;
} catch (error) {
  Logger.error(JSON.stringify(error));
}
</script>

<template>
  <div class="container">
    <div>
      <h2>Seu saldo Atual: {{ CurrencyFormatter.format(currentBalance) }}</h2>
    </div>
  </div>
</template>
