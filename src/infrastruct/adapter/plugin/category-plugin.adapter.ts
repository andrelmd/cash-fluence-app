import { CategoryEntity } from "../../../domain/entity/category.entity";
import { CategoryGateway } from "../../../domain/gateway/category.gateway";
import { DatabaseManager, databaseManager } from "./database-manager-plugin";

export class CategoryPluginAdapter implements CategoryGateway {
  classLogPrefix = "Category Plugin Adapter -";
  constructor(private readonly databaseManager: DatabaseManager) {}

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const logPrefix = `${this.classLogPrefix} getCategoryById() -`;
    if (id < 1)
      throw Error(
        `${logPrefix} Cannot get category with id below 1, id: ${id}`,
      );
    return this.databaseManager.getCategoryById(id);
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.databaseManager.getAllCategories();
  }

  async addCategory(category: CategoryEntity): Promise<CategoryEntity> {
    const logPrefix = `${this.classLogPrefix} addCategory() -`;
    if (category.id != 0)
      throw Error(
        `${logPrefix} cannot add category with id, id: ${category.id}`,
      );
    return this.databaseManager.addCategory(category);
  }
}

const categoryPluginAdapter = new CategoryPluginAdapter(databaseManager);
export { categoryPluginAdapter };
