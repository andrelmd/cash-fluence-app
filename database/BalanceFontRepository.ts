import Database from "tauri-plugin-sql-api";
import { BalanceFont, BalanceFontInterface } from "~/entities/BalanceFont";
import { DatabaseService, databaseService } from "./DatabaseService";

class BalanceFontRepository {
  databaseConnection: Database;

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database;
    this.initBalanceFonts();
  }

  private async initBalanceFonts() {
    await this.databaseConnection.execute(
      'CREATE TABLE IF NOT EXISTS "balance_fonts" ("id" integer PRIMARY KEY AUTOINCREMENT,"name" varchar);'
    );
  }

  async getBalanceFonts() {
    const balanceFonts = await this.databaseConnection.select<
      Array<BalanceFontInterface>
    >("SELECT * from balance_fonts");
    return balanceFonts.map((it) => new BalanceFont(it));
  }
}
export const balanceFontRepository = new BalanceFontRepository(databaseService);
