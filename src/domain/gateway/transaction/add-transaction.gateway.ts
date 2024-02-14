import { TransactionEntity } from "../../entity/transaction.entity";

export interface AddTransactionGateway {
  addTransaction: (
    transaction: TransactionEntity
  ) => Promise<TransactionEntity>;
}
