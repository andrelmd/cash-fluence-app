import { TransactionEntity } from "../../entity/transaction.entity";
import { GetTransactionsGateway } from "../../gateway/transaction/get-transactions.gateway";

export class GetTransactionsUseCase {
  constructor(private readonly transactionsGateway: GetTransactionsGateway) {}

  async execute(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    return this.transactionsGateway.getTransactions(page, limit);
  }
}
