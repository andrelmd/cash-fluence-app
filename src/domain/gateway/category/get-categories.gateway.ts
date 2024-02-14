import { CategoryEntity } from "../../entity/category.entity";

export interface GetCategoriesGateway {
  getCategories: () => Promise<CategoryEntity[]>;
}
