import { TransactionEntity } from "../../../../domain/entity/transaction.entity";
import { GetExpenseTransactionsGateway } from "../../../../domain/gateway/transaction/get-expense-transactions.gateway";
import { DatabaseManager } from "../database-manager-plugin";

export class GetExpenseTransactionsAdapter
  implements GetExpenseTransactionsGateway
{
  constructor(private readonly databaseManager: DatabaseManager) {}

  async getExpenseTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    return this.databaseManager.getExpenseTransactions(page, limit);
  }
}
