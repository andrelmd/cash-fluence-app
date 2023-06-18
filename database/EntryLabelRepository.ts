import Database from "tauri-plugin-sql-api";
import { DatabaseService } from "./DatabaseService";

export class EntryLabelRepository {
  databaseConnection: Database;

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database;
    this.initEntryLabels();
  }

  private async initEntryLabels() {
    await this.databaseConnection.execute(
      'CREATE TABLE IF NOT EXISTS "entry_labels" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"name" varchar,' +
        '"color" varchar,' +
        '"entry_id" integer,' +
        '"entry_type_id" integer,' +
        'FOREIGN KEY ("entry_id") REFERENCES "entries" ("id"),' +
        'FOREIGN KEY ("entry_type_id") REFERENCES "entry_type" ("id")' +
        ");"
    );
  }
}
