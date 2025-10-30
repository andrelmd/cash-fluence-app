import Database, { QueryResult } from "@tauri-apps/plugin-sql";
import { Logger } from "../../logger/logger.class";
import { DatabaseAdapter, IDeleteOptions, ISaveOptions, ISelectOptions, IUpdateOptions } from "../types/database.types";
import { DataMapper } from "./data-mapper";
import { QueryBuilder } from "./query-builder";

export class SqliteAdapter implements DatabaseAdapter {
	private database: Database | null = null;
	private readonly queryBuilder = new QueryBuilder();
	private readonly dataMapper = new DataMapper();

	async init(): Promise<void> {
		const startTime = Date.now();
		Logger.log("Initializing sqlite connection");
		this.database = await Database.load("sqlite:cash_fluence.db");
		Logger.log(`Sqlite connection initialized in ${Date.now() - startTime}ms`);
	}

	async find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]> {
		const db = this.getDB();

		const { query, values } = this.queryBuilder.buildSelectQuery(options);

		const rawEntities: any[] = await this.executeLoggedQuery(db, query, values);

		return rawEntities.map((entity) => this.dataMapper.transformToEntity<TEntity>(entity));
	}

	async save<TEntity>(options: ISaveOptions<TEntity>): Promise<QueryResult> {
		const db = this.getDB();

		const { query, values } = this.queryBuilder.buildInsertQuery(options);

		const result = await this.executeLoggedMutation(db, query, values);

		return result;
	}

	async findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null> {
		const db = this.getDB();

		const { query, values } = this.queryBuilder.buildSelectQuery({ ...options, limit: 1 });

		const rawEntities: any[] = await this.executeLoggedQuery(db, query, values);

		if (rawEntities.length === 0) return null;

		return rawEntities.map((entity) => this.dataMapper.transformToEntity<TEntity>(entity))[0];
	}

	async update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void> {
		const db = this.getDB();

		const { query, values } = this.queryBuilder.buildUpdateQuery(options);

		await this.executeLoggedMutation(db, query, values);
	}

	async delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void> {
		const db = this.getDB();

		const { query, values } = this.queryBuilder.buildDeleteQuery(options);

		await this.executeLoggedMutation(db, query, values);
	}

	private getDB(): Database {
		if (!this.database) {
			throw new Error("Database not initialized. Call init() first.");
		}
		return this.database;
	}

	private logQuery(query: string, values: any[]): void {
		Logger.log(`Executing query: ${query}`);
		Logger.log(`With values: ${JSON.stringify(values)}\n`);
	}

	private async executeLoggedQuery<T>(db: Database, query: string, values: any[]): Promise<T> {
		this.logQuery(query, values);
		return await db.select(query, values);
	}

	private async executeLoggedMutation(db: Database, query: string, values: any[]): Promise<QueryResult> {
		this.logQuery(query, values);
		return await db.execute(query, values);
	}
}
