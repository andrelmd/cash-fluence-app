import Database, { QueryResult } from "@tauri-apps/plugin-sql";
import { Logger } from "../../logger/logger.class";
import { DataMapper } from "../helpers/data-mapper";
import { QueryBuilder } from "../helpers/query-builder";
import { IDatabaseAdapter } from "../interfaces/database-adapter.interface";
import { IDeleteOptions } from "../interfaces/delete-options.interface";
import { ISaveOptions } from "../interfaces/save-options.interface";
import { ISelectOptions } from "../interfaces/select-options.interface";
import { IUpdateOptions } from "../interfaces/update-options.interface";

export class SqliteAdapter implements IDatabaseAdapter {
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

		// Transforma a entidade para o formato do banco de dados ANTES de construir a query
		const rawData = this.dataMapper.trasformToRawEntity(options.data);
		const { query, values } = this.queryBuilder.buildInsertQuery({
			...options,
			data: rawData,
		});

		const result = await this.executeLoggedMutation(db, query, values);

		return result;
	}

	async findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null> {
		const db = this.getDB();

		// Transforma as chaves do 'where' para o formato do banco de dados
		const rawWhere = this.dataMapper.trasformToRawEntity(options.where || {});
		const { query, values } = this.queryBuilder.buildSelectQuery({
			...options,
			where: rawWhere,
			limit: 1,
		});

		const rawEntities: any[] = await this.executeLoggedQuery(db, query, values);

		if (rawEntities.length === 0) return null;

		return rawEntities.map((entity) => this.dataMapper.transformToEntity<TEntity>(entity))[0];
	}

	async update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void> {
		const db = this.getDB();

		// Transforma os dados e o 'where' para o formato do banco de dados
		const rawData = this.dataMapper.trasformToRawEntity(options.data);
		const rawWhere = this.dataMapper.trasformToRawEntity(options.where || {});
		const { query, values } = this.queryBuilder.buildUpdateQuery({
			...options,
			data: rawData,
			where: rawWhere,
		});

		await this.executeLoggedMutation(db, query, values);
	}

	async delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void> {
		const db = this.getDB();
		// Transforma as chaves do 'where' para o formato do banco de dados
		const rawWhere = this.dataMapper.trasformToRawEntity(options.where || {});
		const { query, values } = this.queryBuilder.buildDeleteQuery({
			...options,
			where: rawWhere,
		});

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

	private logResult(result: any): void {
		Logger.log(`Result: ${JSON.stringify(result)}\n`);
	}

	private async executeLoggedQuery<T>(db: Database, query: string, values: any[]): Promise<T> {
		try {
			this.logQuery(query, values);
			const result = await db.select<T>(query, values);
			this.logResult(result);
			return result;
		} catch (error) {
			Logger.log(JSON.stringify(error));
			throw error;
		}
	}

	private async executeLoggedMutation(db: Database, query: string, values: any[]): Promise<QueryResult> {
		try {
			this.logQuery(query, values);
			const result = await db.execute(query, values);
			this.logResult(result);
			return result;
		} catch (error) {
			Logger.log(JSON.stringify(error));
			throw error;
		}
	}
}
