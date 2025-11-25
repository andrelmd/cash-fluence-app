import { transactionsService } from "../../transactions/services/transactions-service-impl"
import { RecurrenceProcessor } from "./recurrence-processor"
import { recurrencesService } from "./recurrences-service-impl"

export const recurrenceProcessor = new RecurrenceProcessor(recurrencesService, transactionsService)
