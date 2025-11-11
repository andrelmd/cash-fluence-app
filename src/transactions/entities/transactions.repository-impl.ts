import { databaseService } from "../../database/services/database-service-impl";
import { TransactionsRepository } from "./transactions-repository";

export const transactionsRepository = new TransactionsRepository(databaseService, "transactions");
