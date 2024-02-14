import { TransactionEntity } from "../../entity/transaction.entity"
import { AddTransactionGateway } from "../../gateway/transaction/add-transaction.gateway"

export class AddTransactionUseCase {
  constructor(private readonly transactionGateway: AddTransactionGateway) {}

  execute(
    transaction: TransactionEntity
  ): TransactionEntity | Promise<TransactionEntity> {
    return this.transactionGateway.addTransaction(transaction)
  }
}
