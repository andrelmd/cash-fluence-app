import { CategoryEntity } from "../../entity/category.entity"

export interface AddCategoryGateway {
  addCategory: (categoryEntity: CategoryEntity) => Promise<CategoryEntity>
}
