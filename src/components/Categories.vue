<script async setup lang="ts">
import { ref } from "vue";
import { databaseManager } from "../configurations/DatabaseManager";
import { CategoryModel } from "../models/CategoryModel";
import Logger from "../helpers/Logger";

const categories = ref<CategoryModel[]>([]);

try {
  categories.value = await databaseManager.getCategories();
} catch (error) {
  Logger.error(`Categories.vue - setup() - error: ${JSON.stringify(error)}`);
}

const newTitle = ref("");

const addCategory = async () => {
  const addCategorySQL = `INSERT INTO categories (title) VALUES ('${newTitle.value}')`;
  await databaseManager.insert(addCategorySQL);
  categories.value = await databaseManager.getCategories();
};
</script>

<template>
  <div class="container">
    <h2>Categorias</h2>
    <form class="row g-3" @submit.prevent="addCategory">
      <div class="col-auto">
        <label for="inputCategory" class="visually-hidden">Categoria</label>
        <input
          type="text"
          class="form-control"
          id="inputCategory"
          placeholder="Categoria"
          v-model="newTitle"
        />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3">Adicionar</button>
      </div>
    </form>
    <div v-for="category of categories" :key="category.id">
      <p>{{ category.title }}</p>
    </div>
  </div>
</template>
