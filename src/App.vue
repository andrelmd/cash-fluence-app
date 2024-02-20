<script setup lang="ts">
import CategoriesComponent from "./components/categories.component.vue";
import CurrentBalanceComponent from "./components/current-balance.component.vue";
import TransactionsComponent from "./components/transactions.component.vue";

</script>

<template>
  <div class="container">
    <!-- Heading -->
    <div>
      <Suspense>
        <template #default>
          <CurrentBalanceComponent />
        </template>
        <template #fallback>
          <div>
            <span>Loading...</span>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Body -->
    <div>
      <Suspense>
        <template #default>
          <div class="center">
            <TransactionsComponent />
          </div>
        </template>
        <template #fallback>
          <div>
            <span>Loading...</span>
          </div>
        </template>
      </Suspense>
    </div>
    <div>
      <Suspense>
        <template #default>
          <CategoriesComponent />
        </template>
        <template #fallback>
          <div>
            <span>Loading...</span>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}
</style>