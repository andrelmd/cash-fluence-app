import { CategoryEntity } from "../entity/category.entity";

export interface CategoryGateway {
  getCategoryById(id: number): CategoryEntity | Promise<CategoryEntity>;
  getAllCategories(): CategoryEntity[] | Promise<CategoryEntity[]>;
  addCategory(category: CategoryEntity): Promise<CategoryEntity>;
}
