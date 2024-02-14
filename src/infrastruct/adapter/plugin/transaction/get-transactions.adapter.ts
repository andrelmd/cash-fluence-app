import { TransactionEntity } from "../../../../domain/entity/transaction.entity"
import { GetTransactionsGateway } from "../../../../domain/gateway/transaction/get-transactions.gateway"
import { DatabaseManager } from "../database-manager-plugin"

export class GetTransactionsAdapter implements GetTransactionsGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async getTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    return this.databaseManager.getTransactions(page, limit)
  }
}
