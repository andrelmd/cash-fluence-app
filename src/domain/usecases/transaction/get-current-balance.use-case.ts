import { TransactionGateway } from "../../gateway/transaction.gateway";

export class GetCurrentBalanceUseCase {
  constructor(private readonly transactionGateway: TransactionGateway) {}

  async execute() {
    return this.transactionGateway.getCurrentBalance();
  }
}
