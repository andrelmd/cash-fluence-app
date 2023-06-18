import Database from "tauri-plugin-sql-api";
import {
  BalanceByFont,
  BalanceByFontInterface,
} from "~/entities/BalanceByFont";
import { DatabaseService, databaseService } from "./DatabaseService";

class BalanceByFontRepository {
  databaseConnection: Database;

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database;
    this.initBalanceByFonts();
  }

  private async initBalanceByFonts() {
    await this.databaseConnection.execute(
      'CREATE TABLE IF NOT EXISTS "balance_by_fonts" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"balance_font_id" integer,' +
        '"balance" float,' +
        '"created_at" timestamptz,' +
        'FOREIGN KEY ("balance_font_id") REFERENCES "balance_fonts" ("id")' +
        ");"
    );
  }

  async getBalanceByFonts() {
    const balanceByFonts = await this.databaseConnection.select<
      Array<BalanceByFontInterface>
    >("SELECT * FROM balance_by_fonts");
    return balanceByFonts.map((it) => new BalanceByFont(it));
  }
}
export const balanceByFontRepository = new BalanceByFontRepository(
  databaseService
);
