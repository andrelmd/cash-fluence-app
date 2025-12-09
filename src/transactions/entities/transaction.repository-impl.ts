import { Tables } from "../../database/constants/tables"
import { databaseService } from "../../database/services/database-service-impl"
import { TransactionRepository } from "./transaction-repository"

export const transactionRepository = new TransactionRepository(databaseService, Tables.TRANSACTIONS)
