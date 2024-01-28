import { DatabaseManager, databaseManager } from "../database-manager-plugin";
import { TransactionEntity } from "../../../../domain/entity/transaction.entity";
import { TransactionGateway } from "../../../../domain/gateway/transaction.gateway";

class TransactionPluginAdapter implements TransactionGateway {
  private classPrefix = "Plugin Transaction Adapter -";
  constructor(private readonly databaseManager: DatabaseManager) {}
  async addTransaction(
    transaction: TransactionEntity,
  ): Promise<TransactionEntity> {
    const logPrefix = `${this.classPrefix} addTransaction() -`;
    if (transaction.id != 0)
      throw new Error(`${logPrefix} cannot add an already saved transaction`);

    if (!(transaction.date instanceof Date))
      transaction.date = new Date(transaction.date);
    if (isNaN(transaction.date.getTime()))
      throw new Error(
        `${logPrefix} cannot add transaction with wrong date ${transaction.date}`,
      );
    if (transaction.categoryId === 0)
      throw new Error(`${logPrefix} cannot add transaction without category`);
    if (transaction.typeId === 0)
      throw new Error(`${logPrefix} cannot add transaction without a type`);
    if (transaction.title === "")
      throw new Error(`${logPrefix} cannot add transaction without a title`);

    return this.databaseManager.addTransaction(transaction);
  }

  async removeTransaction(id: number): Promise<boolean> {
    const logPrefix = `${this.classPrefix} removeTransaction() -`;
    if (id < 1)
      throw new Error(
        `${logPrefix} Cannot remove transaction with id below 1, id: ${id}`,
      );

    return this.databaseManager.removeTransaction(id);
  }

  async getIncomeTransactions() {
    return this.databaseManager.getIncomeTransactions();
  }

  async getExpenseTransactions() {
    return this.databaseManager.getExpenseTransactions();
  }

  async getCurrentBalance() {
    return this.databaseManager.getCurrentBalance();
  }
}

const transactionPluginAdapter = new TransactionPluginAdapter(databaseManager);

export { TransactionPluginAdapter, transactionPluginAdapter };
