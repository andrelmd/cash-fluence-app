import Database from "tauri-plugin-sql-api";
import { Entry, EntryInterface } from "~/entities/Entry";
import { DatabaseService, databaseService } from "./DatabaseService";

class EntryRepository {
  databaseConnection: Database;

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database;
    this.initEntries();
  }

  private async initEntries() {
    await this.databaseConnection.execute(
      'CREATE TABLE IF NOT EXISTS "entries" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"value" float,' +
        '"name" varying character,' +
        '"entry_type_id" integer,' +
        '"created_at" timestamptz,' +
        'FOREIGN KEY ("entry_type_id") REFERENCES "entry_type" ("id")' +
        ");"
    );
  }
  async getEntries() {
    const entries = await this.databaseConnection.select<Array<EntryInterface>>(
      "SELECT * FROM entries"
    );
    return entries.map((it) => new Entry(it));
  }
}

export const entryRepository = new EntryRepository(databaseService);
