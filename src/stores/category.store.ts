import { defineStore } from "pinia"
import { CategoryEntity } from "../domain/entity/category.entity"
import {
  addCategoryUseCasePluginImpl,
  getCategoriesUseCasePluginImpl,
} from "../implementations/plugin"

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: new Array<CategoryEntity>(),
  }),
  getters: {},
  actions: {
    async getCategories() {
      this.categories = await getCategoriesUseCasePluginImpl.execute()
    },
    async addCategory(category: CategoryEntity) {
      const newCategory = await addCategoryUseCasePluginImpl.execute(category)
      this.categories.push(newCategory)
    },
  },
})
