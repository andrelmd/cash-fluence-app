import Database from "tauri-plugin-sql-api";
import { DB_URL } from "../../../configurations/Constants";
import Logger from "../../../helpers/Logger";
import { TransactionEntity } from "../../../domain/entity/transaction.entity";
import { CategoryEntity } from "../../../domain/entity/category.entity";
import { TransactionTypes } from "../../../enums/TransactionTypes";

type TDatabaseTransaction = {
  id: number;
  title: string;
  value: number;
  category_id: number;
  type_id: number;
  date: string;
};

type TDatabaseCategory = {
  id: number;
  title: string;
};

class DatabaseManager {
  private database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  async execute(sql: string, args: any[] = []) {
    this.database.execute(sql, args);
  }

  async getCurrentBalance(): Promise<number> {
    const result = await this.database.select<{ total_value: number }>(
      `
  SELECT SUM(CASE WHEN t.type_id = $1 THEN -t.value ELSE t.value END) as total_value
  FROM transactions t;
`,
      [TransactionTypes.EXPENSE],
    );

    return result.total_value;
  }

  private tDatabaseTransactionToTransactionEntity(
    entity: TDatabaseTransaction,
  ) {
    return new TransactionEntity({
      value: entity.value,
      typeId: entity.type_id,
      categoryId: entity.category_id,
      title: entity.title,
      id: entity.id,
      date: new Date(entity.date),
    });
  }

  async getTransactionById(id: number): Promise<TransactionEntity> {
    const result = await this.database.select<TDatabaseTransaction>(
      "SELECT * FROM transactions WHERE id = $1",
      [id],
    );

    return this.tDatabaseTransactionToTransactionEntity(result);
  }

  async addTransaction(
    transaction: TransactionEntity,
  ): Promise<TransactionEntity> {
    const result = await this.database.execute(
      "INSERT INTO transactions (title,value,category_id,type_id,date) VALUES ($1,$2,$3,$4,$5)",
      [
        transaction.title,
        transaction.value,
        transaction.categoryId,
        transaction.typeId,
        transaction.date.toISOString(),
      ],
    );

    return await this.getTransactionById(result.lastInsertId);
  }

  async removeTransaction(id: number): Promise<boolean> {
    const result = await this.database.execute(
      `DELETE FROM transactions WHERE id = $1`,
      [id],
    );
    return result.rowsAffected > 0;
  }

  async getIncomeTransactions(): Promise<TransactionEntity[]> {
    const result = await this.database.select<TDatabaseTransaction[]>(
      `SELECT * FROM transactions where type_id = $1`,
      [TransactionTypes.INCOME],
    );

    return result.map((it) => this.tDatabaseTransactionToTransactionEntity(it));
  }

  async getExpenseTransactions(): Promise<TransactionEntity[]> {
    const result = await this.database.select<TDatabaseTransaction[]>(
      `SELECT * FROM transactions where type_id = $1`,
      [TransactionTypes.EXPENSE],
    );

    return result.map((it) => this.tDatabaseTransactionToTransactionEntity(it));
  }

  async addCategory(category: CategoryEntity): Promise<CategoryEntity> {
    const result = await this.database.execute(
      `INSERT INTO categories (title) VALUES ($1)`,
      [category.title],
    );

    return this.getCategoryById(result.lastInsertId);
  }
  async getCategoryById(id: number): Promise<CategoryEntity> {
    const result = await this.database.select<TDatabaseCategory>(
      "SELECT * FROM categories WHERE id = $1",
      [id],
    );

    return new CategoryEntity(result);
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    const result = await this.database.select<TDatabaseCategory[]>(
      "SELECT * FROM categories",
    );

    return result.map((it) => new CategoryEntity(it));
  }
}

const databaseManager = new DatabaseManager(await Database.load(DB_URL));

const categoriesTableSQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
  `;

const transactionsTableSQL = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    value REAL NOT NULL,
    category_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
  );
  `;
try {
  Logger.info("Checking tables...");
  await databaseManager.execute(categoriesTableSQL);
  await databaseManager.execute(transactionsTableSQL);
  Logger.info("Tables created");
} catch (error: any) {
  Logger.error(`ConfigurationManager.ts - error: ${error}`);
  Logger.error(JSON.stringify(error));
}

export { databaseManager, DatabaseManager };
