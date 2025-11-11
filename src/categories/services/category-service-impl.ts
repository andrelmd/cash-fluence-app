import { categoryRepository } from "../entities/category-repository-impl";
import { CategoryService } from "./category-service";

export const categoryService = new CategoryService(categoryRepository);
