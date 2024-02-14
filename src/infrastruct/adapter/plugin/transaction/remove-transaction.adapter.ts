import { RemoveTransactionGateway } from "../../../../domain/gateway/transaction/remove-transaction.gateway"
import { DatabaseManager } from "../database-manager-plugin"

export class RemoveTransactionAdapter implements RemoveTransactionGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async removeTransaction(id: number): Promise<boolean> {
    return this.databaseManager.removeTransaction(id)
  }
}
