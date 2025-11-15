import { transactionsRepository } from "../entities/transactions.repository-impl"
import { TransactionsService } from "./transactions-service"

export const transactionsService = new TransactionsService(transactionsRepository)
