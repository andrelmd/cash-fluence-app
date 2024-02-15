import { AddCategoryUseCase } from "../domain/usecases/category/add-category.use-case"
import { GetCategoriesUseCase } from "../domain/usecases/category/get-all-categories.use-case"
import { AddTransactionUseCase } from "../domain/usecases/transaction/add-transaction.use-case"
import { GetCurrentBalanceUseCase } from "../domain/usecases/transaction/get-current-balance.use-case"
import { GetExpenseTransactionsUseCase } from "../domain/usecases/transaction/get-expense-transactions.use-case"
import { GetIncomeTransactionsUseCase } from "../domain/usecases/transaction/get-income-transactions.use-case"
import { GetTransactionsUseCase } from "../domain/usecases/transaction/get-transactions.use-case"
import { RemoveTransactionUseCase } from "../domain/usecases/transaction/remove-transaction.use-case"
import { AddCategoryAdapter } from "../infrastruct/adapter/plugin/category/add-category.adapters"
import { GetCategoriesAdapter } from "../infrastruct/adapter/plugin/category/get-categories.adapter"
import { databaseManager } from "../infrastruct/adapter/plugin/database-manager-plugin"
import { AddTransactionAdapter } from "../infrastruct/adapter/plugin/transaction/add-transaction.adapter"
import { GetCurrentBalanceAdapter } from "../infrastruct/adapter/plugin/transaction/get-current-balance.adapter"
import { GetExpenseTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-expense-transactions.adapter"
import { GetIncomeTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-income-transacions.adapter"
import { GetTransactionsAdapter } from "../infrastruct/adapter/plugin/transaction/get-transactions.adapter"
import { RemoveTransactionAdapter } from "../infrastruct/adapter/plugin/transaction/remove-transaction.adapter"

export const getCategoriesUseCasePluginImpl = new GetCategoriesUseCase(
  new GetCategoriesAdapter(databaseManager)
)
export const addCategoryUseCasePluginImpl = new AddCategoryUseCase(
  new AddCategoryAdapter(databaseManager)
)

export const getTransactionsUseCasePluginImpl = new GetTransactionsUseCase(
  new GetTransactionsAdapter(databaseManager)
)
export const getIncomeTransactionsUseCasePluginImpl =
  new GetIncomeTransactionsUseCase(
    new GetIncomeTransactionsAdapter(databaseManager)
  )
export const getExpenseTransactionsUseCasePluginImpl =
  new GetExpenseTransactionsUseCase(
    new GetExpenseTransactionsAdapter(databaseManager)
  )
export const addTransactionUseCasePluginImpl = new AddTransactionUseCase(
  new AddTransactionAdapter(databaseManager)
)
export const removeTransactionUseCasePluginImpl = new RemoveTransactionUseCase(
  new RemoveTransactionAdapter(databaseManager)
)
export const getCurrentBalanceUseCasePluginImpl = new GetCurrentBalanceUseCase(
  new GetCurrentBalanceAdapter(databaseManager)
)
