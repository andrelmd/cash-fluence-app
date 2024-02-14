import { TransactionEntity } from "../../entity/transaction.entity";

export interface GetExpenseTransactionsGateway {
  getExpenseTransactions: (
    page: number,
    limit: number
  ) => Promise<TransactionEntity[]>;
}
