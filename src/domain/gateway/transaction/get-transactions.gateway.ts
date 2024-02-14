import { TransactionEntity } from "../../entity/transaction.entity";

export interface GetTransactionsGateway {
  getTransactions: (
    page: number,
    limit: number
  ) => Promise<TransactionEntity[]>;
}
