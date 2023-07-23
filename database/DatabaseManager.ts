import { appConfigDir } from '@tauri-apps/api/path'
import Database from 'tauri-plugin-sql-api'
import { LogLevels } from '~/enums/LogLevels'
import Logger from '~/helpers/Logger'

class DatabaseManager {
  private db: Database
  private static initPromise: Promise<Database> | undefined = undefined
  private constructor(db: Database) {
    this.db = db
  }
  static async init() {
    let db: Database
    Logger.log(LogLevels.debug, 'initializing database')
    Logger.log(LogLevels.debug, `app config dir is ${await appConfigDir()}`)

    if (!this.initPromise) this.initPromise = Database.load('sqlite:fin_app.db')
    db = await this.initPromise
    if (!db) {
      Logger.log(LogLevels.error, 'database could not be initialized')
      throw new Error('database could not be initialized')
    }
    Logger.log(LogLevels.debug, 'database initialized')
    return new DatabaseManager(db)
  }

  async transaction<T>(callback: () => Promise<T>) {
    const startTransactionQuery = 'BEGIN TRANSACTION;'
    try {
      Logger.log(LogLevels.debug, 'starting transaction')
      await this.execute(startTransactionQuery).then(() =>
        Logger.log(LogLevels.debug, 'transaction started'),
      )
      const result = await callback().then((result) => {
        Logger.log(
          LogLevels.debug,
          `callback executed with result ${JSON.stringify(result)}`,
        )
        return result
      })
      const commitTransactionQuery = 'COMMIT;'
      await this.execute(commitTransactionQuery).then(() =>
        Logger.log(LogLevels.debug, 'transaction commited'),
      )
      return result
    } catch (error) {
      Logger.log(
        LogLevels.error,
        `transaction failed with error ${error}, rolling back`,
      )

      const rollbackTransactionQuery = 'ROLLBACK;'
      await this.execute(rollbackTransactionQuery).then(() =>
        Logger.log(LogLevels.debug, 'transaction rolled back'),
      )
    }
  }

  async execute(query: string): Promise<any> {
    Logger.log(LogLevels.query, query)
    return this.db.execute(query)
  }

  async select<T>(query: string): Promise<T> {
    Logger.log(LogLevels.query, query)
    return this.db.select<T>(query)
  }
}

export default DatabaseManager
export const databaseManager = await DatabaseManager.init()
