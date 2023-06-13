import Database from "tauri-plugin-sql-api";
import {
  BalanceByFont,
  BalanceByFontInterface,
} from "~/entities/BalanceByFont";
import { BalanceFont, BalanceFontInterface } from "~/entities/BalanceFont";

class DatabaseService {
  private database: Database;

  private constructor(database: Database) {
    this.database = database;
  }
  static async init() {
    const database = await Database.load("sqlite:fin_app.db");
    const databaseService = new DatabaseService(database);
    await databaseService.initBalanceFonts();
    await databaseService.initBalanceByFonts();
    await databaseService.initEntryType();
    await databaseService.initEntries();
    await databaseService.initEntryLabels();
    return databaseService;
  }

  async test() {
    return this.database.select("SELECT 1+1 as RESULT");
  }

  private async initBalanceFonts() {
    await this.database.execute(
      'CREATE TABLE IF NOT EXISTS "balance_fonts" ("id" integer PRIMARY KEY AUTOINCREMENT,"name" varchar);'
    );
  }

  private async initBalanceByFonts() {
    await this.database.execute(
      'CREATE TABLE IF NOT EXISTS "balance_by_fonts" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"balance_font_id" integer,' +
        '"balance" float,' +
        '"created_at" timestamptz,' +
        'FOREIGN KEY ("balance_font_id") REFERENCES "balance_fonts" ("id")' +
        ");"
    );
  }

  private async initEntryType() {
    await this.database.execute(
      'CREATE TABLE IF NOT EXISTS "entry_type" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"name" varchar' +
        ");"
    );
  }

  private async initEntries() {
    await this.database.execute(
      'CREATE TABLE IF NOT EXISTS "entries" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"value" float,' +
        '"entry_type_id" integer,' +
        '"created_at" timestamptz,' +
        'FOREIGN KEY ("entry_type_id") REFERENCES "entry_type" ("id")' +
        ");"
    );
  }

  private async initEntryLabels() {
    await this.database.execute(
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

  async getBalanceFonts() {
    const balanceFonts = await this.database.select<
      Array<BalanceFontInterface>
    >("SELECT * from balance_fonts");
    return balanceFonts.map((it) => new BalanceFont(it));
  }

  async getBalanceByFonts() {
    const balanceByFonts = await this.database.select<
      Array<BalanceByFontInterface>
    >("SELECT * FROM balance_by_fonts");
    return balanceByFonts.map((it) => new BalanceByFont(it));
  }
}

const databaseService = await DatabaseService.init();

export default databaseService;
