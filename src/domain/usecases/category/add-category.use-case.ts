import { CategoryEntity } from "../../entity/category.entity";
import { CategoryGateway } from "../../gateway/category.gateway";

export class AddCategoryUseCase {
  constructor(private readonly categoryGateway: CategoryGateway) {}

  async execute(category: CategoryEntity) {
    return this.categoryGateway.addCategory(category);
  }
}
