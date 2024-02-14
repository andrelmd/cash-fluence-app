import { GetCurrentBalanceGateway } from "../../../../domain/gateway/transaction/get-current-balance.gateway"
import { DatabaseManager } from "../database-manager-plugin"

export class GetCurrentBalanceAdapter implements GetCurrentBalanceGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async getCurrentBalance(): Promise<number> {
    return this.databaseManager.getCurrentBalance()
  }
}
