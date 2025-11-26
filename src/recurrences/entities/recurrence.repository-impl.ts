import { Tables } from "../../database/constants/tables"
import { databaseService } from "../../database/services/database-service-impl"
import { RecurrenceRepository } from "./recurrence-repository"

export const recurrenceRepository = new RecurrenceRepository(databaseService, Tables.RECURRENCES)
