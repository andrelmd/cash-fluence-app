import { GetExpenseTransactionsGateway } from "../../gateway/transaction/get-expense-transactions.gateway";

export class GetExpenseTransactionsUseCase {
  constructor(
    private readonly transactionGateway: GetExpenseTransactionsGateway
  ) {}

  async execute(page: number, limit: number) {
    return this.transactionGateway.getExpenseTransactions(page, limit);
  }
}
