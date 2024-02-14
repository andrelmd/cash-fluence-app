import { defineStore } from "pinia"
import { TransactionEntity } from "../domain/entity/transaction.entity"
import { AddTransactionUseCase } from "../domain/usecases/transaction/add-transaction.use-case"
import { GetCurrentBalanceUseCase } from "../domain/usecases/transaction/get-current-balance.use-case"
import { GetExpenseTransactionsUseCase } from "../domain/usecases/transaction/get-expense-transactions.use-case"
import { GetIncomeTransactionsUseCase } from "../domain/usecases/transaction/get-income-transactions.use-case"
import { GetTransactionsUseCase } from "../domain/usecases/transaction/get-transactions.use-case"
import { RemoveTransactionUseCase } from "../domain/usecases/transaction/remove-transaction.use-case"
import { TransactionTypes } from "../enums/TransactionTypes"
import { databaseManager } from "../infrastruct/adapter/plugin/database-manager-plugin"
import { AddTransactionAdapter } from "../infrastruct/adapter/plugin/transaction/add-transaction.adapter"
import { GetCurrentBalanceAdapter } from "../infrastruct/adapter/plugin/transaction/get-current-balance.adapter"
import { GetExpenseTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-expense-transactions.adapter"
import { GetIncomeTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-income-transacions.adapter"
import { GetTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-transactions.adapter"
import { RemoveTransactionAdapter } from "../infrastruct/adapter/plugin/transaction/remove-transaction.adapter"

export const useTransactionStore = defineStore("transactionStore", {
  actions: {
    async getTransactions(page: number, limit: number): Promise<void> {
      const getTransactionsUseCase = new GetTransactionsUseCase(
        new GetTransactionsAdapter(databaseManager)
      )
      this.transactions = await getTransactionsUseCase.execute(page, limit)
    },
    async getIncomeTransactions(page: number, limit: number): Promise<void> {
      const getIncomeTransactionsUseCase = new GetIncomeTransactionsUseCase(
        new GetIncomeTransactionsAdapter(databaseManager)
      )
      this.transactions.push(
        ...(await getIncomeTransactionsUseCase.execute(page, limit))
      )
    },
    async getExpenseTransactions(page: number, limit: number): Promise<void> {
      const getExpenseTransactionsUseCase = new GetExpenseTransactionsUseCase(
        new GetExpenseTransactionsAdapter(databaseManager)
      )
      this.transactions.push(
        ...(await getExpenseTransactionsUseCase.execute(page, limit))
      )
    },
    async addTransaction(transaction: TransactionEntity): Promise<void> {
      const addTransactionUseCase = new AddTransactionUseCase(
        new AddTransactionAdapter(databaseManager)
      )

      this.transactions.push(await addTransactionUseCase.execute(transaction))
      await this.getCurrentBalance()
    },
    async removeTransaction(id: number): Promise<void> {
      const removeTransactionUseCase = new RemoveTransactionUseCase(
        new RemoveTransactionAdapter(databaseManager)
      )
      await removeTransactionUseCase.execute(id)
      this.transactions = this.transactions.filter((t) => t.id !== id)
      await this.getCurrentBalance()
    },
    async getCurrentBalance(): Promise<void> {
      const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(
        new GetCurrentBalanceAdapter(databaseManager)
      )
      console.log(await getCurrentBalanceUseCase.execute())
      this.currentBalance = await getCurrentBalanceUseCase.execute()
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
