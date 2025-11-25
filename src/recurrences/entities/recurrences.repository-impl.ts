import { databaseService } from "../../database/services/database-service-impl"
import { RecurrencesRepository } from "./recurrences-repository"

export const recurrencesRepository = new RecurrencesRepository(databaseService, "recurrences")
