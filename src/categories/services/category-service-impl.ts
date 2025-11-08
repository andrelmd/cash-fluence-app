import { categoryRepository } from "../entities/category.repository";
import { CategoryService } from "./category.service.class";

export const categoryService = new CategoryService(categoryRepository);
