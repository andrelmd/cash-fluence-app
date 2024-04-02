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
  <v-container fill-width>
    <v-layout>
      <v-card>
        <v-card-title>
          <h2>Categorias</h2>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-row>
              <v-col>
                <v-text-field v-model="title" label="Título" style="min-width: 150px;" />
              </v-col>
              <v-col>
                <v-btn type="submit" @click="addCategory">Adicionar</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-table>
            <tr>
              <th>Titulo</th>
            </tr>
            <tr v-for="category of categoryStore.categories" :key="category.id">
              {{ category.title }}
            </tr>
          </v-table>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>
