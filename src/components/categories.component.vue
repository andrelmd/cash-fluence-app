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

    <form @submit.prevent="addCategory">
      <div>
        <label for="inputCategory">Categoria</label>
        <input type="text" id="inputCategory" placeholder="Categoria" v-model="title" />
      </div>
      <div>
        <button type="submit" class="btn btn-primary">Adicionar</button>
      </div>
    </form>
    <table>
      <tr v-for="category of categoryStore.categories" :key="category.id">
        {{ category.title }}
      </tr>
    </table>
  </div>
</template>

<style scoped></style>