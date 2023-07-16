import { invoke } from '@tauri-apps/api'
import { appConfigDir } from '@tauri-apps/api/path'
import Database from 'tauri-plugin-sql-api'
import { LogLevels } from '~/enums/LogLevels'

export default class DatabaseManager {
  private static db: Database | undefined
  private static initPromise: Promise<Database> | undefined = undefined
  private constructor() {}
  static async init() {
    if (this.db) return this.db
    else {
      invoke('log', {
        level: LogLevels.info,
        message: `connecting to database at ${await appConfigDir()}`,
      })
      if (!this.initPromise)
        this.initPromise = Database.load('sqlite:fin_app.db')
      this.db = await this.initPromise
      return this.db
    }
  }
  static async close() {
    if (this.db) {
      await this.db.close()
      this.db = undefined
    }
  }

  static async transaction<T>(callback: () => Promise<T>) {
    if (!this.db) await this.init()
    if (!this.db) {
      invoke('log', {
        level: LogLevels.error,
        message: `Database could not be initialized`,
      })
      throw new Error('Database could not be initialized')
    }
    try {
      invoke('log', {
        level: LogLevels.info,
        message: `Starting transaction`,
      })
      await this.db.execute('BEGIN TRANSACTION;').then(() =>
        invoke('log', {
          level: LogLevels.info,
          message: `Transaction started`,
        }),
      )
      const result = await callback().then((result) => {
        invoke('log', {
          level: LogLevels.info,
          message: `callback executed with result ${JSON.stringify(result)}`,
        })
        return result
      })
      await this.db.execute('COMMIT;').then(() =>
        invoke('log', {
          level: LogLevels.info,
          message: `Transaction commited`,
        }),
      )
      return result
    } catch (error) {
      invoke('log', {
        level: LogLevels.error,
        message: `Transaction failed with error ${error}`,
      })
      await this.db.execute('ROLLBACK;').then(() =>
        invoke('log', {
          level: LogLevels.info,
          message: `Transaction rolled back`,
        }),
      )
    }
  }

  async execute(query: string) {
    if (!DatabaseManager.db) await DatabaseManager.init()
    if (!DatabaseManager.db) {
      invoke('log', {
        level: LogLevels.error,
        message: `Database could not be initialized`,
      })
      throw new Error('Database could not be initialized')
    }
    return DatabaseManager.db.execute(query)
  }

  async select<T>(query: string) {
    if (!DatabaseManager.db) await DatabaseManager.init()
    if (!DatabaseManager.db) {
      invoke('log', {
        level: LogLevels.error,
        message: `Database could not be initialized`,
      })
      throw new Error('Database could not be initialized')
    }
    return DatabaseManager.db.select<T>(query)
  }
}
