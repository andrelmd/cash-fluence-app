import { TransactionEntity } from "../../entity/transaction.entity";
import { TransactionGateway } from "../../gateway/transaction.gateway";

export class AddTransactionUseCase {
  constructor(private readonly transactionGateway: TransactionGateway) {}

  execute(
    transaction: TransactionEntity,
  ): TransactionEntity | Promise<TransactionEntity> {
    return this.transactionGateway.addTransaction(transaction);
  }
}
