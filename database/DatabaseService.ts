import { appConfigDir } from "@tauri-apps/api/path";
import Database from "tauri-plugin-sql-api";

export class DatabaseService {
  database: Database;

  private constructor(database: Database) {
    this.database = database;
  }
  static async init() {
    console.info(`connecting to database at ${await appConfigDir()}`);
    const database = await Database.load("sqlite:fin_app.db");
    const databaseService = new DatabaseService(database);
    return databaseService;
  }

  async test() {
    return this.database.select("SELECT 1+1 as RESULT");
  }
}

export const databaseService = await DatabaseService.init();
