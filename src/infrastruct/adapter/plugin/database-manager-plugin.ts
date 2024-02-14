import Database, { QueryResult } from "tauri-plugin-sql-api"
import { DB_URL } from "../../../configurations/Constants"
import { CategoryEntity } from "../../../domain/entity/category.entity"
import { TransactionEntity } from "../../../domain/entity/transaction.entity"
import { TransactionTypes } from "../../../enums/TransactionTypes"
import Logger from "../../../helpers/Logger"

type TDatabaseTransaction = {
  id: number
  title: string
  value: number
  category_id: number
  type_id: number
  date: string
}

type TDatabaseCategory = {
  id: number
  title: string
}

class DatabaseManager {
  private database: Database
  private constructor(database: Database) {
    this.database = database
  }

  static async init(database: Database): Promise<DatabaseManager> {
    const databaseManager = new DatabaseManager(database)
    const categoriesTableSQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
  `

    const transactionsTableSQL = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    value REAL NOT NULL,
    category_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
  `
    await databaseManager.execute(categoriesTableSQL)
    await databaseManager.execute(transactionsTableSQL)
    return databaseManager
  }

  async select<T>(sql: string, args?: unknown[]): Promise<T[]> {
    Logger.debug(`Executing SQL: ${sql} with args: ${args}`)
    return this.database.select<T[]>(sql, args)
  }

  async execute(sql: string, args?: unknown[]): Promise<QueryResult> {
    Logger.debug(`Executing SQL: ${sql} with args: ${args}`)
    return this.database.execute(sql, args)
  }

  async getCurrentBalance(): Promise<number> {
    const result = await this.select<{ total_value: number }>(
      `
  SELECT SUM(CASE WHEN t.type_id = $1 THEN -t.value ELSE t.value END) as total_value
  FROM transactions t;
`,
      [TransactionTypes.EXPENSE]
    )
    return result[0].total_value
  }

  private tDatabaseTransactionToTransactionEntity(
    entity: TDatabaseTransaction
  ) {
    return new TransactionEntity({
      amount: entity.value,
      typeId: entity.type_id,
      categoryId: entity.category_id,
      title: entity.title,
      id: entity.id,
      date: new Date(entity.date),
    })
  }

  async getTransactionById(id: number): Promise<TransactionEntity> {
    const result = await this.select<TDatabaseTransaction>(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    )

    return this.tDatabaseTransactionToTransactionEntity(result[0])
  }

  async addTransaction(
    transaction: TransactionEntity
  ): Promise<TransactionEntity> {
    const result = await this.execute(
      "INSERT INTO transactions (title,value,category_id,type_id,date) VALUES ($1,$2,$3,$4,$5)",
      [
        transaction.title,
        transaction.amount,
        transaction.categoryId,
        transaction.typeId,
        transaction.date.toISOString(),
      ]
    )

    return new TransactionEntity({ ...transaction, id: result.lastInsertId })
  }

  async removeTransaction(id: number): Promise<boolean> {
    const result = await this.execute(
      `DELETE FROM transactions WHERE id = $1`,
      [id]
    )
    return result.rowsAffected > 0
  }

  async getIncomeTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    const result = await this.select<TDatabaseTransaction>(
      `SELECT * FROM transactions where type_id = $1 LIMIT $2 OFFSET $3`,
      [TransactionTypes.INCOME, limit, page * limit]
    )

    return result.map((it) => this.tDatabaseTransactionToTransactionEntity(it))
  }

  async getExpenseTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    const result = await this.select<TDatabaseTransaction>(
      `SELECT * FROM transactions where type_id = $1 LIMIT $2 OFFSET $3`,
      [TransactionTypes.EXPENSE, limit, page * limit]
    )

    return result.map((it) => this.tDatabaseTransactionToTransactionEntity(it))
  }

  async addCategory(category: CategoryEntity): Promise<CategoryEntity> {
    const result = await this.execute(
      `INSERT INTO categories (title) VALUES ($1)`,
      [category.title]
    )

    return new CategoryEntity({ ...category, id: result.lastInsertId })
  }
  async getCategoryById(id: number): Promise<CategoryEntity> {
    const result = await this.select<TDatabaseCategory>(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    )

    return new CategoryEntity(result[0])
  }

  async getCategories(): Promise<CategoryEntity[]> {
    const result = await this.select<TDatabaseCategory>(
      "SELECT * FROM categories"
    )

    return result.map((it) => new CategoryEntity(it))
  }
  async getTransactions(
    page: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    const result = await this.select<TDatabaseTransaction>(
      `SELECT * FROM transactions LIMIT $1 OFFSET $2`,
      [limit, page * limit]
    )
    return result.map((it) => this.tDatabaseTransactionToTransactionEntity(it))
  }
}

const databaseManager = await DatabaseManager.init(await Database.load(DB_URL))

export { DatabaseManager, databaseManager }
