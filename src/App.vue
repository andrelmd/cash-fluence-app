<script setup lang="ts">
import Categories from "./components/Categories.vue";
import CurrentBalance from "./components/CurrentBalance.vue";
import Transactions from "./components/Transactions.vue";

</script>

<template>
  <div>
    <!-- Heading -->
    <div class="heading">
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
    <!-- Body -->
    <div>
      <Suspense>
        <template #default>
          <div class="center">
            <Transactions />
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

<style>
body {
  background-color: var(--info);
  color: var(--info);
}

.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
  border-radius: 5px;
} 

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>