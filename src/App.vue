<script setup lang="ts">
import CategoriesComponent from "./components/categories.component.vue";
import CurrentBalanceComponent from "./components/current-balance.component.vue";
import TransactionsComponent from "./components/transactions.component.vue";

</script>

<template>
  <v-container>
    <!-- Heading -->
    <v-layout align-center justify-center>
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
    </v-layout>

    <!-- Body -->
    <v-layout>
      <Suspense>
        <template #default>
          <div>
            <TransactionsComponent />
          </div>
        </template>
        <template #fallback>
          <div>
            <span>Loading...</span>
          </div>
        </template>
      </Suspense>
    </v-layout>
    <v-layout>
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
    </v-layout>
  </v-container>
</template>

<style scoped></style>