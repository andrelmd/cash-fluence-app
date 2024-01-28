<script async setup lang="ts">
import { ref } from "vue";
import Logger from "../helpers/Logger";
import { CategoryEntity } from "../domain/entity/category.entity";
import { GetAllCategoriesUseCase } from "../domain/usecases/category/get-all-categories.use-case";
import { categoryPluginAdapter } from "../infrastruct/adapter/plugin/category-plugin.adapter";
import { AddCategoryUseCase } from "../domain/usecases/category/add-category.use-case.ts";

const categories = ref(new Array<CategoryEntity>());

try {
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
    categoryPluginAdapter,
  );

  categories.value = await getAllCategoriesUseCase.execute();
} catch (error) {
  Logger.error(`Categories.vue - setup() - error: ${JSON.stringify(error)}`);
}

const newTitle = ref("");

const addCategory = async () => {
  const addCategoryUseCase = new AddCategoryUseCase(categoryPluginAdapter);

  try {
    await addCategoryUseCase.execute(
      new CategoryEntity({ title: newTitle.value }),
    );
  } catch (error) {}
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
