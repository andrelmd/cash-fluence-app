import { TransactionEntity } from "../../../../domain/entity/transaction.entity";
import { AddTransactionGateway } from "../../../../domain/gateway/transaction/add-transaction.gateway";
import { DatabaseManager } from "../database-manager-plugin";

export class AddTransactionAdapter implements AddTransactionGateway {
  constructor(private readonly databaseManager: DatabaseManager) {}
  async addTransaction(
    transaction: TransactionEntity
  ): Promise<TransactionEntity> {
    if (!transaction) throw new Error("Transaction is required");
    if (!(transaction instanceof TransactionEntity))
      throw new Error("Invalid transaction");

    if (!transaction.amount) throw new Error("Amount is required");
    if (!transaction.categoryId) throw new Error("Category is required");
    if (!transaction.date) throw new Error("Date is required");
    if (!transaction.title) throw new Error("Title is required");
    if (!transaction.typeId) throw new Error("Type is required");

    return await this.databaseManager.addTransaction(transaction);
  }
}
