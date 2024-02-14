import { defineStore } from "pinia"
import { CategoryEntity } from "../domain/entity/category.entity"
import { AddCategoryUseCase } from "../domain/usecases/category/add-category.use-case"
import { GetCategoriesUseCase } from "../domain/usecases/category/get-all-categories.use-case"
import { AddCategoryAdapter } from "../infrastruct/adapter/plugin/category/add-category.adapters"
import { GetCategoriesAdapter } from "../infrastruct/adapter/plugin/category/get-categories.adapter"
import { databaseManager } from "../infrastruct/adapter/plugin/database-manager-plugin"

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: new Array<CategoryEntity>(),
  }),
  getters: {},
  actions: {
    async getCategories() {
      const getCategoriesUseCase = new GetCategoriesUseCase(
        new GetCategoriesAdapter(databaseManager)
      )
      this.categories = await getCategoriesUseCase.execute()
    },
    async addCategory(category: CategoryEntity) {
      const addCategoryUseCase = new AddCategoryUseCase(
        new AddCategoryAdapter(databaseManager)
      )
      const newCategory = await addCategoryUseCase.execute(category)
      this.categories.push(newCategory)
    },
  },
})
