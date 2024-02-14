import { GetCategoriesGateway } from "../../gateway/category/get-categories.gateway"

export class GetCategoriesUseCase {
  constructor(private readonly categoryGateway: GetCategoriesGateway) {}

  execute() {
    return this.categoryGateway.getCategories()
  }
}
