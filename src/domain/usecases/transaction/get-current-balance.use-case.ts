import { GetCurrentBalanceGateway } from "../../gateway/transaction/get-current-balance.gateway";

export class GetCurrentBalanceUseCase {
  constructor(private readonly transactionGateway: GetCurrentBalanceGateway) {}

  async execute() {
    return this.transactionGateway.getCurrentBalance();
  }
}
