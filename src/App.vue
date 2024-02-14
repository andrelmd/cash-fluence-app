<script setup lang="ts">
import Categories from "./components/Categories.vue";
import CurrentBalance from "./components/CurrentBalance.vue";
import Transactions from "./components/Transactions.vue";

</script>

<template>
  <div class="container">
    <div>
      <Suspense><template #default>
          <CurrentBalance />
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
          <Transactions />
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
          <Categories />
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
