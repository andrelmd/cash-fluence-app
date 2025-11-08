import { databaseService } from "../../database/services/database.service";
import { TransactionsRepository } from "./transactions-repository.class";

export const transactionsRepository = new TransactionsRepository(databaseService, "transactions");
