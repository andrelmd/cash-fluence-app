import { CategoryEntity } from "../../../../domain/entity/category.entity"
import { AddCategoryGateway } from "../../../../domain/gateway/category/add-categoty.gateway"
import { DatabaseManager } from "../database-manager-plugin"

export class AddCategoryAdapter implements AddCategoryGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async addCategory(categoryEntity: CategoryEntity): Promise<CategoryEntity> {
    return this.databaseManager.addCategory(categoryEntity)
  }
}
