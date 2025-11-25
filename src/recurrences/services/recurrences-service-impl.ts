import { recurrencesRepository } from "../entities/recurrences.repository-impl"
import { RecurrencesService } from "./recurrences-service"

export const recurrencesService = new RecurrencesService(recurrencesRepository)
