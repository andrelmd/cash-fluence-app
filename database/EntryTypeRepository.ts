import Database from "tauri-plugin-sql-api";
import { EntryType, EntryTypeInterface } from "~/entities/EntryType";
import { DatabaseService, databaseService } from "./DatabaseService";

export class EntryTypeRepository {
  databaseConnection: Database;

  constructor(databaseService: DatabaseService) {
    this.databaseConnection = databaseService.database;
    this.init();
  }

  private async init() {
    await this.databaseConnection.execute(
      'CREATE TABLE IF NOT EXISTS "entry_type" (' +
        '"id" integer PRIMARY KEY AUTOINCREMENT,' +
        '"name" varchar,' +
        'UNIQUE("name")' +
        ");"
    );
    const initialTypes = [{ name: "Entrada" }, { name: "Saída" }];
    const alreadyInserted = await this.getEntryTypes();
    const toPersist = initialTypes.filter(
      (it) => !alreadyInserted.find((inserted) => inserted.name === it.name)
    );
    if (toPersist.length) {
      console.info(`Inserting entry types ${toPersist.join(", ")}`);
      await this.save(toPersist);
    }
  }

  private async save(entities: Array<Partial<EntryType>>) {
    const toUpdate = entities.filter((it) => it.id);
    const toSave = entities.filter((it) => !it.id);
    await this.databaseConnection.execute(`BEGIN TRANSACTION;`);
    try {
      const insertQuery = `INSERT INTO "entry_type" (name) values ${toSave
        .map((it) => `('${it.name}')`)
        .join(",\n")};`;

      const updateQuery = toUpdate
        .map(
          (it) =>
            `UPDATE "entry_type" SET name = '${it.name}' WHERE id = ${it.id};`
        )
        .join("\n");

      return await this.databaseConnection.execute(
        `${insertQuery}\n${updateQuery}\nCOMMIT;`
      );
    } catch (error) {
      console.warn(`erorr while saving: ${error}`);
      await this.databaseConnection.execute(`ROLLBACK;`);
    }
  }

  async getEntryTypes() {
    const entryTypes = await this.databaseConnection.select<
      Array<EntryTypeInterface>
    >(`SELECT * FROM "entry_type"`);
    return entryTypes.map((it) => new EntryType(it));
  }
}

export const entryTypeRepository = new EntryTypeRepository(databaseService);
