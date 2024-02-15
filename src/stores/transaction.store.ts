import { defineStore } from "pinia"
import { TransactionEntity } from "../domain/entity/transaction.entity"
import { TransactionTypes } from "../enums/TransactionTypes"
import {
  addTransactionUseCasePluginImpl,
  getCurrentBalanceUseCasePluginImpl,
  getExpenseTransactionsUseCasePluginImpl,
  getIncomeTransactionsUseCasePluginImpl,
  getTransactionsUseCasePluginImpl,
  removeTransactionUseCasePluginImpl,
} from "../implementations/plugin"
import Logger from "../helpers/Logger"

export const useTransactionStore = defineStore("transactionStore", {
  actions: {
    async getTransactions(page: number, limit: number): Promise<void> {
      this.transactions = await getTransactionsUseCasePluginImpl.execute(
        page,
        limit
      )
    },
    async getIncomeTransactions(page: number, limit: number): Promise<void> {
      this.transactions.push(
        ...(await getIncomeTransactionsUseCasePluginImpl.execute(page, limit))
      )
    },
    async getExpenseTransactions(page: number, limit: number): Promise<void> {
      this.transactions.push(
        ...(await getExpenseTransactionsUseCasePluginImpl.execute(page, limit))
      )
    },
    async addTransaction(transaction: TransactionEntity): Promise<void> {
      Logger.info(`Adding transaction: ${JSON.stringify(transaction)}`)
      this.transactions.push(
        await addTransactionUseCasePluginImpl.execute(transaction)
      )
      await this.getCurrentBalance()
    },
    async removeTransaction(id: number): Promise<void> {
      await removeTransactionUseCasePluginImpl.execute(id)
      this.transactions = this.transactions.filter((t) => t.id !== id)
      await this.getCurrentBalance()
    },
    async getCurrentBalance(): Promise<void> {
      this.currentBalance = await getCurrentBalanceUseCasePluginImpl.execute()
    },
  },
  getters: {
    incomes(): TransactionEntity[] {
      return this.transactions.filter(
        (t) => t.typeId === TransactionTypes.INCOME
      )
    },
    expenses(): TransactionEntity[] {
      return this.transactions.filter(
        (t) => t.typeId === TransactionTypes.EXPENSE
      )
    },
  },
  state: () => ({
    transactions: new Array<TransactionEntity>(),
    currentBalance: 0,
  }),
})
