import { invoke } from '@tauri-apps/api'
import { ITransaction, Transaction } from '~/entities/Transaction'
import { LogLevels } from '~/enums/LogLevels'
import DatabaseManager from '../database/DatabaseManager'
import { QueryResult } from 'tauri-plugin-sql-api'

class TransactionRepository {
  private tableName = 'transactions'
  private databaseManager: DatabaseManager

  constructor(databaseManager: DatabaseManager) {
    this.databaseManager = databaseManager
    this.initEntries()
  }

  private async initEntries() {
    invoke('log', {
      level: LogLevels.info,
      message: `Initializing table ${this.tableName}`,
    })
    await DatabaseManager.transaction<QueryResult>(() =>
      this.databaseManager.execute(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (${[
          '"id" INTEGER PRIMARY KEY AUTOINCREMENT',
          '"value" FLOAT',
          '"name" TEXT',
          '"transaction_type_id" INTEGER',
          '"date" TIMESTAMPTZ',
        ].join(',')});`,
      ),
    )
  }
  async findMany(where?: { [key: string]: string | number }) {
    const selectQuery = `SELECT * FROM ${this.tableName}`
    if (where) {
      const whereQuery = Object.entries(where)
        .map(([key, value]) => `${key} = ${value}`)
        .join(' AND ')
      const entries = await this.databaseManager.select<Array<ITransaction>>(
        `${selectQuery} WHERE ${whereQuery}`,
      )
      return entries.map((it) => new Transaction(it))
    }
    const entries = await this.databaseManager.select<Array<ITransaction>>(
      `SELECT * FROM ${this.tableName}`,
    )
    return entries.map((it) => new Transaction(it))
  }

  async save(entities: Array<Partial<Transaction>> | Partial<Transaction>) {
    return await DatabaseManager.transaction(async () => {
      const insertQuery = Array.isArray(entities)
        ? `INSERT INTO ${
            this.tableName
          } (value, name, transaction_type_id, date) VALUES ${entities
            .map(
              (it) =>
                `(${it.value}, '${it.name}', ${
                  it.transactioTypeId
                }, '${it.date?.toISOString()}')`,
            )
            .join(', ')};`
        : `INSERT INTO ${
            this.tableName
          } (value, name, transaction_type_id, date) VALUES (${
            entities.value
          }, '${entities.name}', ${
            entities.transactioTypeId
          }, '${entities.date?.toISOString()}')`

      return (
        await this.databaseManager.select<Array<ITransaction>>(
          `${insertQuery} RETURNING *;`,
        )
      ).map((it) => new Transaction(it))
    })
  }

  async delete(
    transaction: Partial<Transaction> | Array<Partial<Transaction>>,
  ) {
    return await DatabaseManager.transaction(async () => {
      const deleteQuery = Array.isArray(transaction)
        ? `DELETE FROM ${this.tableName} WHERE id IN (${transaction
            .filter((it) => it.id !== undefined && it.id !== null)
            .map((it) => it.id)
            .join(', ')});`
        : `DELETE FROM ${this.tableName} WHERE id = ${transaction.id};`
      return await this.databaseManager.execute(deleteQuery)
    })
  }
}

export const transactionRepository = new TransactionRepository(
  await DatabaseManager.init(),
)
