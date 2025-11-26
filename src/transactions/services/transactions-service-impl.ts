import { transactionRepository } from "../entities/transaction.repository-impl"
import { TransactionsService } from "./transactions-service"

export const transactionsService = new TransactionsService(transactionRepository)
