import Database from "tauri-plugin-sql-api";
import { DB_URL } from "./Constants";
import Logger from "../helpers/Logger";
import { TransactionTypes } from "../enums/TransactionTypes";
import { CategoryModel } from "../models/CategoryModel";
import { TransactionModel } from "../models/TransactionModel";

export class DatabaseManager {
  database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  async select<T>(sqlQuery: string): Promise<Array<T>> {
    const result = await this.database.select<Array<T>>(sqlQuery);
    return result;
  }

  async selectOne<T>(sqlQuery: string): Promise<T> {
    const result = await this.database.select<Array<T>>(sqlQuery);
    return result[0];
  }

  async insert(sqlQuery: string): Promise<number> {
    const result = await this.database.execute(sqlQuery);
    return result.lastInsertId;
  }

  async getCategories(): Promise<CategoryModel[]> {
    const getCategoriesSQL = ` SELECT * FROM categories;`;
    const categories = await this.select<CategoryModel>(getCategoriesSQL);
    return categories.map((category) => new CategoryModel(category));
  }

  async saveTransaction(transactionModel: TransactionModel) {
    if (transactionModel.id) {
      Logger.error("Trying to save a transaction that already exists");
      return transactionModel;
    }
    const saveTransactionSQL = `
    INSERT INTO transactions (title, value, category_id, type_id, date) VALUES
    ("${transactionModel.title}", ${transactionModel.value}, ${transactionModel.category_id}, ${transactionModel.type_id}, "${transactionModel.date}");
    `;

    const resultId = await this.insert(saveTransactionSQL);
    transactionModel.id = resultId;
    return transactionModel;
  }

  async deleteTransaction(id: number): Promise<void> {
    const sqlQuery = `DELETE FROM transactions WHERE id = ${id};`;
    await this.database.execute(sqlQuery);
  }

  async getTransactions(options?: {
    where?: { id?: number; type_id?: number };
  }): Promise<TransactionModel[]> {
    let sqlQuery = `SELECT * FROM transactions;`;
    if (options) {
      if (options.where) {
        const [keys, values] = Object.entries(options.where).reduce(
          (acc, [key, value]) => {
            acc[0].push(key);
            acc[1].push(value);
            return acc;
          },
          [[], []] as [string[], any[]],
        );
        sqlQuery = `SELECT * FROM transactions WHERE ${keys
          .map((key, i) => `${key} = ${values[i]} `)
          .join(" AND ")};`;
      }
    }

    const transactions = await this.select<TransactionModel>(sqlQuery);
    Logger.debug(`DatabaseManager.ts - getTransactions() - debug: ${sqlQuery}`);
    Logger.debug(
      `DatabaseManager.ts - getTransactions() - debug: ${JSON.stringify(
        transactions,
      )}`,
    );
    return transactions.map((transaction) => new TransactionModel(transaction));
  }
}

const databaseManager = new DatabaseManager(await Database.load(DB_URL));

const typeTableSQL = `
  CREATE TABLE IF NOT EXISTS types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
  `;

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
    Foreign KEY (type_id) REFERENCES types(id)
  );
  `;
try {
  Logger.info("Checking tables...");
  await databaseManager.database.execute(typeTableSQL);
  await databaseManager.database.execute(categoriesTableSQL);
  await databaseManager.database.execute(transactionsTableSQL);
  Logger.info("Tables created");
} catch (error: any) {
  Logger.error(`ConfigurationManager.ts - error: ${error}`);
  Logger.error(JSON.stringify(error));
}

const createTypesSQL =
  `
  INSERT INTO types (title) VALUES
` +
  Object.values(TransactionTypes)
    .map((type) => `("${type}")`)
    .join(",") +
  ";";

const selectTypesSQL = `
  SELECT * FROM types;
`;
const transactionTypeEntities: Array<{ id: number; title: string }> = [];

try {
  Logger.info(`ConfigurationManager.ts - populateTypes() - info`);
  transactionTypeEntities.push(
    ...(await databaseManager.select<{
      id: number;
      title: string;
    }>(selectTypesSQL)),
  );
  if (transactionTypeEntities.length === 0) {
    Logger.info(`ConfigurationManager.ts - populateTypes() - info`);
    await databaseManager.database.execute(createTypesSQL);
    transactionTypeEntities.push(
      ...(await databaseManager.select<{ id: number; title: string }>(
        selectTypesSQL,
      )),
    );
  }
  Logger.debug(JSON.stringify(transactionTypeEntities));
  Logger.info(`ConfigurationManager.ts - populateTypes() - info`);
} catch (error: any) {
  Logger.error(`ConfigurationManager.ts - populateTypes() - error: ${error}`);
}
export { databaseManager, transactionTypeEntities };
