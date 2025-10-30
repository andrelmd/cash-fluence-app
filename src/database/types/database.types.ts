import { QueryResult } from "@tauri-apps/plugin-sql";

export interface DatabaseAdapter {
	init(): Promise<void>;
	find<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity[]>;
	findOne<TEntity>(options: ISelectOptions<TEntity>): Promise<TEntity | null>;
	save<TEntity>(entity: ISaveOptions<TEntity>): Promise<QueryResult>;
	update<TEntity>(options: IUpdateOptions<TEntity>): Promise<void>;
	delete<TEntity>(options: IDeleteOptions<TEntity>): Promise<void>;
}

export interface ISaveOptions<TEntity> {
	table: string;
	data: Partial<TEntity>;
	primaryKeys?: string[];
}

export interface ISelectOptions<TEntity> {
	table: string;
	where?: IWhere<TEntity>;
	limit?: number;
	offset?: number;
	orderBy?: string;
	groupBy?: string;
}

export interface IDeleteOptions<TEntity> {
	table: string;
	where?: IWhere<TEntity>;
}

export interface IUpdateOptions<TEntity> {
	table: string;
	data: Partial<TEntity>;
	where?: IWhere<TEntity>;
}

export type IWhereOperator<TEntity> = { operator: string; value: TEntityValue<TEntity> | TEntityValue<TEntity>[] };

export type TEntityValue<TEntity> =
	| Partial<TEntity[keyof TEntity]>
	| Partial<TEntity[keyof TEntity]>[]
	| IWhereOperator<TEntity>
	| undefined;

export type IWhere<TEntity> = { [key in keyof Partial<TEntity>]: TEntityValue<TEntity> };
