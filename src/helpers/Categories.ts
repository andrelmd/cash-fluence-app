import { databaseManager } from "../configurations/DatabaseManager";
import { CategoryModel } from "../models/CategoryModel";
import Logger from "./Logger";

export const categories = new Map<number, CategoryModel>();

try {
  Logger.debug("Categories.ts - setup() - debug: updating categories");

  const cotegoriesModels = await databaseManager.getCategories();
  cotegoriesModels.forEach((categoryModel) => {
    categories.set(categoryModel.id, categoryModel);
  });

  Logger.debug("Categories.ts - setup() - debug: categories updated");
} catch (error) {
  Logger.error(`Categories.ts - setup() - error: ${error}`);
}

let updatePromise: Promise<Map<number, CategoryModel>> | null = null;

export async function updateCategories() {
  if (updatePromise) return updatePromise;
  updatePromise = new Promise(async (resolve) => {
    const categoryModels = await databaseManager.getCategories();
    categoryModels.forEach((categoryModel) => {
      categories.set(categoryModel.id, categoryModel);
    });
    resolve(categories);
  });
  return await updatePromise;
}
