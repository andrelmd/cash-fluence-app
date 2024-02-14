<script async setup lang="ts">
import { ref } from 'vue';
import { CategoryEntity } from '../domain/entity/category.entity';
import { useCategoryStore } from '../stores/category.store';


const categoryStore = useCategoryStore();
const title = ref('');

await categoryStore.getCategories();

const addCategory = async () => {
  await categoryStore.addCategory(new CategoryEntity({ title: title.value }));
};
</script>

<template>
  <div class="container">
    <h2>Categorias</h2>
    <form class="row g-3" @submit.prevent="addCategory">
      <div class="col-auto">
        <label for="inputCategory" class="visually-hidden">Categoria</label>
        <input type="text" class="form-control" id="inputCategory" placeholder="Categoria" v-model="title" />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3">Adicionar</button>
      </div>
    </form>
    <div v-for="category of categoryStore.categories" :key="category.id">
      <p>{{ category.title }}</p>
    </div>
  </div>
</template>
