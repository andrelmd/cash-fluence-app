import { CategoryGateway } from "../../gateway/category/category.gateway";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryGateway: CategoryGateway) {}

  execute(id: number) {
    return this.categoryGateway.getCategoryById(id);
  }
}
