import { CategoryGateway } from "../../gateway/category.gateway";

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryGateway: CategoryGateway) {}

  execute() {
    return this.categoryGateway.getAllCategories();
  }
}
