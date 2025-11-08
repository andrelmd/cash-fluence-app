import { SqliteAdapter } from "../adapters/sqlite.adpater";
import { DatabaseService } from "./database-service.class";

const sqliteAdapter = new SqliteAdapter();
sqliteAdapter.init();

export const databaseService = new DatabaseService(sqliteAdapter);
