import { GetIncomeTransactionsGateway } from "../../gateway/transaction/get-income-transactions.gateway";

export class GetIncomeTransactionsUseCase {
  constructor(private readonly transactionGateway: GetIncomeTransactionsGateway) {}

  async execute(page: number, limit: number) {
    return this.transactionGateway.getIncomeTransactions(page, limit);
  }
}
