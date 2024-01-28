import { TransactionGateway } from "../../gateway/transaction.gateway";

export class GetExpenseTransactionUseCase {
  constructor(private readonly transactionGateway: TransactionGateway) {}

  async execute() {
    return this.transactionGateway.getExpenseTransactions();
  }
}
