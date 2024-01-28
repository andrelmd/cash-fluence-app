import { TransactionGateway } from "../../gateway/transaction.gateway";

export class GetIncomeTransactionsUseCase {
  constructor(private readonly transactionGateway: TransactionGateway) {}

  async execute() {
    return this.transactionGateway.getIncomeTransactions();
  }
}
