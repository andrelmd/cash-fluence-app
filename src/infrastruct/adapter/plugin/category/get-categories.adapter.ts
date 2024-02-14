import { CategoryEntity } from "../../../../domain/entity/category.entity"
import { GetCategoriesGateway } from "../../../../domain/gateway/category/get-categories.gateway"
import { DatabaseManager } from "../database-manager-plugin"

export class GetCategoriesAdapter implements GetCategoriesGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}
  async getCategories(): Promise<CategoryEntity[]> {
    return this.databaseManager.getCategories()
  }
}
