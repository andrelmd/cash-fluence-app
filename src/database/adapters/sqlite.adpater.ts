import Database, { QueryResult } from "@tauri-apps/plugin-sql"
import { Logger } from "../../logger/logger.class"
import { DataMapper } from "../helpers/data-mapper"
import { QueryBuilder } from "../helpers/query-builder"
import { IDatabaseAdapter } from "../interfaces/database-adapter"
import { IDeleteOptions } from "../interfaces/delete-options"
import { ISaveOptions } from "../interfaces/save-options"
import { ISelectOptions } from "../interfaces/select-options"
import { IUpdateOptions } from "../interfaces/update-options"
import { IUpsertOptions } from "../interfaces/upsert-options"

export class SqliteAdapter implements IDatabaseAdapter {
	private database: Database | null = null
	private readonly queryBuilder = new QueryBuilder()
	private readonly dataMapper = new DataMapper()

	async init(): Promise<void> {
		const startTime = Date.now()
		const database_path = import.meta.env.VITE_DB_HOST || "cash_fluence"
		Logger.info(`Initializing sqlite connection to ${database_path}`)
		this.database = await Database.load(`sqlite:${database_path}.db`)
		Logger.info(`Sqlite connection initialized in ${Date.now() - startTime}ms`)
	}

	async find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]> {
		const db = this.getDB()

		const rawHere = this.dataMapper.trasformToRaw(options.where)
		const rawOrderBy = this.dataMapper.trasformToRaw(options.orderBy)
		const { query, values } = this.queryBuilder.buildSelectQuery({
			...options,
			where: rawHere,
			orderBy: rawOrderBy,
		})

		const rawEntities: any[] = await this.executeLoggedQuery(db, query, values)

		return rawEntities.map((entity) => this.dataMapper.transformToEntity<TEntity>(entity))
	}

	async save<TEntity>(options: ISaveOptions<TEntity>): Promise<QueryResult> {
		const db = this.getDB()

		const rawData = this.dataMapper.trasformToRaw(options.data)
		const { query, values } = this.queryBuilder.buildInsertQuery({
			...options,
			data: rawData,
		})

		const result = await this.executeLoggedMutation(db, query, values)

		return result
	}

	async findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null> {
		const db = this.getDB()

		const rawWhere = this.dataMapper.trasformToRaw(options.where)
		const rawOrderBy = this.dataMapper.trasformToRaw(options.orderBy)
		const { query, values } = this.queryBuilder.buildSelectQuery({
			...options,
			where: rawWhere,
			orderBy: rawOrderBy,
			limit: 1,
		})

		const rawEntities: any[] = await this.executeLoggedQuery(db, query, values)

		if (rawEntities.length === 0) return null

		return rawEntities.map((entity) => this.dataMapper.transformToEntity<TEntity>(entity))[0]
	}

	async update<TEntity>(options: IUpdateOptions<TEntity>): Promise<QueryResult> {
		const db = this.getDB()

		const rawData = this.dataMapper.trasformToRaw(options.data)
		const rawWhere = this.dataMapper.trasformToRaw(options.where || {})
		const { query, values } = this.queryBuilder.buildUpdateQuery({
			...options,
			data: rawData,
			where: rawWhere,
		})

		return await this.executeLoggedMutation(db, query, values)
	}

	async delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void> {
		const db = this.getDB()
		const rawWhere = this.dataMapper.trasformToRaw(options.where || {})
		const { query, values } = this.queryBuilder.buildDeleteQuery({
			...options,
			where: rawWhere,
		})

		await this.executeLoggedMutation(db, query, values)
	}

	private getDB(): Database {
		if (!this.database) {
			throw new Error("Database not initialized. Call init() first.")
		}
		return this.database
	}

	private logQuery(query: string, values: any[]): void {
		Logger.info(`Executing query: ${query}`)
		Logger.info(`With values: ${JSON.stringify(values)}\n`)
	}

	private async executeLoggedQuery<T>(db: Database, query: string, values: any[]): Promise<T> {
		try {
			this.logQuery(query, values)
			const result = await db.select<T>(query, values)
			return result
		} catch (error) {
			Logger.error("SqlAdapter: Error executing query", error)
			throw error
		}
	}

	private async executeLoggedMutation(db: Database, query: string, values: any[]): Promise<QueryResult> {
		try {
			this.logQuery(query, values)
			const result = await db.execute(query, values)
			return result
		} catch (error) {
			Logger.error("SqlAdapter: Error executing mutation", error)
			throw error
		}
	}

	async upsert<TEntity>(options: IUpsertOptions<TEntity>): Promise<QueryResult> {
		const db = this.getDB()

		const rawData = this.dataMapper.trasformToRaw(options.data)
		const rawWhere = this.dataMapper.trasformToRaw(options.where)
		const rawConflictTarget = this.dataMapper.trasformToRaw(
			options.conflictTarget.reduce((acc, key) => ({ ...acc, [key]: null }), {})
		)

		const { query, values } = this.queryBuilder.buildUpsertQuery({
			...options,
			data: rawData,
			where: rawWhere,
			conflictTarget: Object.keys(rawConflictTarget),
		})

		return await this.executeLoggedMutation(db, query, values)
	}
}
