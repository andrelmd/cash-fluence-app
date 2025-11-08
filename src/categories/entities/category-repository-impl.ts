import { databaseService } from "../../database/services/database.service";
import { CategoryRepository } from "./category-repository";

export const categoryRepository = new CategoryRepository(databaseService, "categories");
