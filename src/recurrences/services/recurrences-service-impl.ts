import { recurrenceRepository } from "../entities/recurrence.repository-impl"
import { RecurrencesService } from "./recurrences-service"

export const recurrencesService = new RecurrencesService(recurrenceRepository)
