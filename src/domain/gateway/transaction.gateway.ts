import { TransactionEntity } from "../entity/transaction.entity";

export interface TransactionGateway {
  addTransaction: (
    transaction: TransactionEntity,
  ) => TransactionEntity | Promise<TransactionEntity>;

  removeTransaction: (id: number) => boolean | Promise<boolean>;
  getIncomeTransactions: () =>
    | TransactionEntity[]
    | Promise<TransactionEntity[]>;

  getExpenseTransactions: () =>
    | TransactionEntity[]
    | Promise<TransactionEntity[]>;

  getCurrentBalance: () => Promise<number>;
}
