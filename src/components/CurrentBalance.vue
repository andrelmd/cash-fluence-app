<script async setup lang="ts">
import { ref } from "vue";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import { transactionPluginAdapter } from "../infrastruct/adapter/plugin/transaction/transaction-plugin.adapter";
import { GetCurrentBalanceUseCase } from "../domain/usecases/transaction/get-current-balance.use-case.ts";
const currentBalance = ref(0);

try {
  const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(
    transactionPluginAdapter,
  );

  currentBalance.value = await getCurrentBalanceUseCase.execute();
} catch (error) {
  throw error;
}
</script>

<template>
  <div class="container">
    <div>
      <h2>Seu saldo Atual: {{ CurrencyFormatter.format(currentBalance) }}</h2>
    </div>
  </div>
</template>
