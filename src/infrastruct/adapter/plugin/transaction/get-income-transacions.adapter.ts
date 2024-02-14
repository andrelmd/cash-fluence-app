import { TransactionEntity } from "../../../../domain/entity/transaction.entity";
import { GetIncomeTransactionsGateway } from "../../../../domain/gateway/transaction/get-income-transactions.gateway";
export class GetIncomeTransactionsAdapter
  implements GetIncomeTransactionsGateway
{
  constructor(
    private readonly getIncomeTransactionsGateway: GetIncomeTransactionsGateway
  ) {}

  async getIncomeTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    return this.getIncomeTransactionsGateway.getIncomeTransactions(page, limit);
  }
}
