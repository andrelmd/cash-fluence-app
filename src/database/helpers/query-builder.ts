import { IDeleteOptions } from "../interfaces/delete-options";
import { ISaveOptions } from "../interfaces/save-options";
import { ISelectOptions } from "../interfaces/select-options";
import { IUpdateOptions } from "../interfaces/update-options";
import { TEntityValue } from "../types/entity-value";
import { TQueryWhere } from "../types/query-where";
import { TWhere } from "../types/where";
import { TWhereOperator } from "../types/where-operator";

export class QueryBuilder {
	buildSelectQuery<TEntity>(options: ISelectOptions<TEntity>): { query: string; values: any[] } {
		const { table, where = null, limit, offset, groupBy, orderBy } = options;

		const { clause: whereClause, values } = this.buildClauseWhere<TEntity>(where);

		const query = [
			this.buildClauseSelect(table),
			whereClause,
			this.buildClauseGroupBy(groupBy),
			//TODO: implement "order by" clausules with entity object
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
		const dataKeys = this.getDefinedKeys(data);

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

	private isIWhereOperator<TEntity>(value: TEntityValue<TEntity> | TEntityValue<TEntity>[]): value is TWhereOperator<TEntity> {
		return typeof value === "object" && value !== null && "operator" in value && "value" in value;
	}

	private operatorFactory<TEntity>(operator: TWhereOperator<TEntity>["operator"]) {
		const operatorHandlers: Partial<
			Record<
				TWhereOperator<TEntity>["operator"],
				(key: string, paramIndex: { value: number }, value: TEntityValue<TEntity> | TEntityValue<TEntity>[]) => string
			>
		> = {
			BETWEEN: (key: string, paramIndex: { value: number }, value) => {
				if (!Array.isArray(value) || value.length !== 2) {
					throw new Error("BETWEEN operator requires an array with two values.");
				}
				const start = `$${paramIndex.value++}`;
				const end = `$${paramIndex.value++}`;
				return `${key} BETWEEN ${start} AND ${end}`;
			},
		};

		const handler = operatorHandlers[operator];
		if (handler) return handler;

		return (key: string, paramIndex: { value: number }) => `${key} ${operator} $${paramIndex.value++}`;
	}

	private buildWhereCondition<TEntity>(key: keyof TWhere<TEntity>, value: TEntityValue<TEntity>, paramIndex: { value: number }): string {
		if (Array.isArray(value)) {
			const placeholders = value.map(() => `$${paramIndex.value++}`);
			return `${String(key)} IN (${placeholders.join(",")})`;
		}

		if (this.isIWhereOperator(value)) {
			const operatorHandler = this.operatorFactory<TEntity>(value.operator);
			return operatorHandler(String(key), paramIndex, value.value);
		}

		return `${String(key)} = $${paramIndex.value++}`;
	}

	private buildClauseWhere<TEntity>(where: TWhere<TEntity> | null, startIndex: number = 1): TQueryWhere<TEntity> {
		if (!where || Object.keys(where).length === 0) {
			return { clause: "", values: [] };
		}

		const definedWhere = Object.entries(where).filter(([, value]) => value !== undefined) as [
			keyof TWhere<TEntity>,
			TEntityValue<TEntity>,
		][];

		if (definedWhere.length === 0) {
			return { clause: "", values: [] };
		}

		const paramIndex = { value: startIndex };
		const conditions = definedWhere.map(([key, value]) => this.buildWhereCondition(key, value, paramIndex));

		const values = definedWhere.flatMap(([, value]) => {
			if (this.isIWhereOperator(value)) {
				return Array.isArray(value.value) ? value.value : [value.value];
			}
			return value;
		});

		return {
			clause: `WHERE ${conditions.join(" AND ")}`,
			values,
		};
	}
}
