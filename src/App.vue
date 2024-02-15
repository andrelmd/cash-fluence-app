<script setup lang="ts">
import Categories from "./components/Categories.vue";
import CurrentBalance from "./components/CurrentBalance.vue";
import Transactions from "./components/Transactions.vue";

</script>

<template>
  <div >
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

<style>
body {
  background-color: var(--info);
  color: var(--info);
}
.container {
  background-color: white;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 8px;
}

.row-even {
  background-color: var(--success);
  width: 100%;
}
tbody {
  width: 100%;
}
.row-odd {
  background-color: var(--danger);
}
</style>