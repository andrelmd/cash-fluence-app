import { RemoveTransactionGateway } from "../../gateway/transaction/remove-transaction.gateway";

export class RemoveTransactionUseCase {
  constructor(private readonly transactionGateway: RemoveTransactionGateway) {}

  async execute(id: number) {
    return this.transactionGateway.removeTransaction(id);
  }
}
