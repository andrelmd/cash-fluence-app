import { Tables } from "../../database/constants/tables"
import { databaseService } from "../../database/services/database-service-impl"
import { CategoryRepository } from "./category-repository"

export const categoryRepository = new CategoryRepository(databaseService, Tables.CATEGORIES)
