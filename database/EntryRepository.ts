import Database from 'tauri-plugin-sql-api'
import { Entry, EntryInterface } from '~/entities/Entry'
import Transaction from '~/helpers/Transaction'
import { DatabaseService, databaseService } from './DatabaseService'

class EntryRepository {
  private table = 'entries'
  databaseConnection: Database

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database
    this.initEntries()
  }

  private async initEntries() {
    await this.databaseConnection.execute(
      `CREATE TABLE IF NOT EXISTS ${this.table} (` +
        '"id" INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '"value" FLOAT,' +
        '"name" TEXT,' +
        '"entry_type_id" INTEGER,' +
        '"created_at" TIMESTAMPTZ,' +
        'FOREIGN KEY ("entry_type_id") REFERENCES "entry_type" ("id")' +
        ');',
    )
  }
  async findMany(where?: { [key: string]: string | number }) {
    const selectQuery = `SELECT * FROM ${this.table}`
    if (where) {
      const whereQuery = Object.entries(where)
        .map(([key, value]) => `${key} = ${value}`)
        .join(' AND ')
      const entries = await this.databaseConnection.select<
        Array<EntryInterface>
      >(`${selectQuery} WHERE ${whereQuery}`)
      return entries.map((it) => new Entry(it))
    }
    const entries = await this.databaseConnection.select<Array<EntryInterface>>(
      `SELECT * FROM ${this.table}`,
    )
    return entries.map((it) => new Entry(it))
  }

  async save(entities: Array<Entry> | Entry) {
    return await Transaction(this.databaseConnection, async () => {
      const insertQuery = Array.isArray(entities)
        ? `INSERT INTO ${
            this.table
          } (value, name, entry_type_id, created_at) VALUES ${entities
            .map(
              (it) =>
                `(${it.value}, '${it.name}', ${
                  it.entryTypeId
                }, '${it.createdAt.toISOString()}')`,
            )
            .join(', ')};`
        : `INSERT INTO ${
            this.table
          } (value, name, entry_type_id, created_at) VALUES (${
            entities.value
          }, '${entities.name}', ${
            entities.entryTypeId
          }, '${entities.createdAt.toISOString()}')`

      return (
        await this.databaseConnection.select<Array<EntryInterface>>(
          `${insertQuery} RETURNING *;`,
        )
      ).map((it) => new Entry(it))
    })
  }

  async delete(entry: Partial<Entry> | Array<Partial<Entry>>) {
    return await Transaction(this.databaseConnection, async () => {
      const deleteQuery = Array.isArray(entry)
        ? `DELETE FROM ${this.table} WHERE id IN (${entry
            .filter((it) => it.id !== undefined && it.id !== null)
            .map((it) => it.id)
            .join(', ')});`
        : `DELETE FROM ${this.table} WHERE id = ${entry.id};`
      return await this.databaseConnection.execute(deleteQuery)
    })
  }
}

export const entryRepository = new EntryRepository(databaseService)
