import { transactionsRepository } from "../entities/transactions.repository";
import { TransactionsService } from "./transactions-service.class";

export const transactionsService = new TransactionsService(transactionsRepository);
