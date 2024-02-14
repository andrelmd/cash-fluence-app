import { CategoryEntity } from "../../entity/category.entity"
import { AddCategoryGateway } from "../../gateway/category/add-categoty.gateway"

export class AddCategoryUseCase {
  constructor(private readonly categoryGateway: AddCategoryGateway) {}

  async execute(category: CategoryEntity) {
    return this.categoryGateway.addCategory(category)
  }
}
