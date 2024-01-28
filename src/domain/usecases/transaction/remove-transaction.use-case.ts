import { TransactionGateway } from "../../gateway/transaction.gateway";

export class RemoveTransactionUseCase {
  constructor(private readonly transactionGateway: TransactionGateway) {}

  async execute(id: number) {
    return this.transactionGateway.removeTransaction(id);
  }
}
