import { TransactionEntity } from "../../entity/transaction.entity";

export interface GetIncomeTransactionsGateway {
  getIncomeTransactions: (
    page: number,
    limit: number
  ) => Promise<TransactionEntity[]>;
}
