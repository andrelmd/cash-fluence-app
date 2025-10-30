import {
	IDeleteOptions,
	ISaveOptions,
	ISelectOptions,
	IUpdateOptions,
	IWhere,
	IWhereOperator,
	TEntityValue,
} from "../types/database.types";

export class QueryBuilder {
	buildSelectQuery<TEntity>(options: ISelectOptions<TEntity>): { query: string; values: any[] } {
		const { table, where = {}, limit, offset, groupBy, orderBy } = options;

		const { clause: whereClause, values } = this.buildClauseWhere(where);

		const query = [
			this.buildClauseSelect(table),
			whereClause,
			this.buildClauseGroupBy(groupBy),
			this.buildClauseOrderBy(orderBy),
			this.buildClauseLimit(limit),
			this.buildClauseOffset(offset),
		]
			.filter(Boolean)
			.join(" ");

		return { query: `${query};`, values: values.flat() };
	}

	buildInsertQuery<TEntity>(options: ISaveOptions<TEntity>): { query: string; values: any[] } {
		const { data, table } = options;

		if (!data) {
			throw new Error("Cannot build insert query with no data.");
		}

		const { clause: insertClause, values } = this.buildClauseInsert(data);

		const query = `INSERT INTO ${table} ${insertClause} RETURNING *;`;

		return { query, values };
	}

	buildUpdateQuery<TEntity>(options: IUpdateOptions<TEntity>): { query: string; values: any[] } {
		const { table, data, where = {} } = options;
		const dataKeys = Object.keys(data).filter((key) => data[key as keyof TEntity] !== undefined);

		if (dataKeys.length === 0) {
			throw new Error("Cannot build update query with no data to update.");
		}

		const { clause: setClause, values: setValues } = this.buildClauseSet(data);
		const { clause: whereClause, values: whereValues } = this.buildClauseWhere(where, dataKeys.length);

		const query = [`UPDATE ${table}`, setClause, whereClause, "RETURNING *;"].filter(Boolean).join(" ");

		return { query, values: [...setValues, ...whereValues.flat()] };
	}

	buildDeleteQuery<TEntity>(options: IDeleteOptions<TEntity>): { query: string; values: any[] } {
		const { table, where = {} } = options;
		const { clause, values } = this.buildClauseWhere(where);

		const query = [`DELETE FROM ${table}`, clause].filter(Boolean).join(" ");

		return { query: `${query};`, values: values.flat() };
	}

	private buildClauseSelect(table: string): string {
		return `SELECT * FROM ${table}`;
	}

	private buildClauseWhere<TEntity>(
		where: IWhere<TEntity>,
		startIndexParam: number = 1,
	): { clause: string; values: TEntityValue<TEntity>[] } {
		const whereKeys = this.getWhereKeys(where);
		const whereValues = this.getWhereValues(where, whereKeys);
		const whereClause = this.generateWhereClause(whereKeys, whereValues, startIndexParam);

		if (!whereClause) {
			return { clause: "", values: [] };
		}

		return {
			clause: `WHERE ${whereClause}`,
			values: whereValues.flatMap((value) => {
				if (this.isIWhereOperator(value)) {
					return Array.isArray(value.value) ? value.value : [value.value];
				}
				return value;
			}),
		};
	}

	private getDefinedKeys<TEntity>(data: Partial<TEntity>): string[] {
		return Object.keys(data).filter((key) => data?.[key as keyof TEntity] !== undefined);
	}
	private buildClauseInsert<TEntity>(data: Partial<TEntity>): { clause: string; values: any[] } {
		const keys = this.getDefinedKeys(data);
		const placeholders = keys.map((_, i) => `$${i + 1}`).join(",");
		const values = keys.map((key) => data[key as keyof TEntity]);

		return {
			clause: `(${keys.join(",")}) VALUES (${placeholders})`,
			values,
		};
	}

	private buildClauseSet<TEntity>(data: Partial<TEntity>, startIndex: number = 1): { clause: string; values: any[] } {
		const keys = this.getDefinedKeys(data);
		const values = keys.map((key) => data[key as keyof TEntity]);

		if (keys.length === 0) {
			return { clause: "", values: [] };
		}

		const setClause = keys.map((key, i) => `${key} = $${startIndex + i}`).join(", ");

		return { clause: `SET ${setClause}`, values };
	}

	private buildClauseLimit(limit?: number): string {
		return limit ? `LIMIT ${limit}` : "";
	}

	private buildClauseOffset(offset?: number): string {
		return offset ? `OFFSET ${offset}` : "";
	}

	private buildClauseGroupBy(groupBy?: string): string {
		return groupBy ? `GROUP BY ${groupBy}` : "";
	}

	private buildClauseOrderBy(orderBy?: string): string {
		return orderBy ? `ORDER BY ${orderBy}` : "";
	}

	private getWhereKeys<TEntity>(where: IWhere<TEntity>): (keyof IWhere<TEntity>)[] {
		return Object.keys(where).filter((key) => where[key as keyof IWhere<TEntity>] !== undefined) as (keyof IWhere<TEntity>)[];
	}

	private getWhereValues<TEntity>(where: IWhere<TEntity>, keys: (keyof IWhere<TEntity>)[]): TEntityValue<TEntity>[] {
		return keys.map((key) => where[key as keyof IWhere<TEntity>]);
	}

	private isIWhereOperator<TEntity>(value: TEntityValue<TEntity> | TEntityValue<TEntity>[]): value is IWhereOperator<TEntity> {
		return typeof value === "object" && "operator" in value && "value" in value;
	}

	private generateWhereClauseOperation<TEntity>(
		key: keyof IWhere<TEntity>,
		value: TEntityValue<TEntity> | TEntityValue<TEntity>[],
		startIndexParam: number,
	): {
		query: string;
		lastIndex: number;
	} {
		let paramIndex = startIndexParam;

		if (Array.isArray(value)) {
			const placeholders = value.map(() => `$${paramIndex++}`);
			const query = `${String(key)} IN (${placeholders.join(",")})`;
			return { query, lastIndex: paramIndex };
		}

		if (this.isIWhereOperator(value)) {
			if (value.operator !== "BETWEEN") {
				const query = `${String(key)} ${value.operator} $${paramIndex++}`;
				return { query, lastIndex: paramIndex };
			}

			if (Array.isArray(value.value) && value.value.length === 2) {
				const query = `${String(key)} BETWEEN $${paramIndex++} AND $${paramIndex++}`;
				return { query, lastIndex: paramIndex };
			}

			throw new Error("BETWEEN operator requires an array with two values.");
		}

		const query = `${String(key)} = $${paramIndex++}`;
		return { query, lastIndex: paramIndex };
	}

	private generateWhereClause<TEntity>(
		keys: (keyof IWhere<TEntity>)[],
		values: TEntityValue<TEntity>[],
		startIndexParam: number,
	): string {
		let paramIndex = startIndexParam;
		return keys
			.map((key, i) => {
				const value = values[i];
				const { query, lastIndex } = this.generateWhereClauseOperation(key, value, paramIndex);
				paramIndex = lastIndex;
				return query;
			})
			.join(" AND ");
	}
}
