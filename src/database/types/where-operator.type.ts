import { IOperator } from "../interfaces/operator.interface";
import { TEntityValue } from "./entity-value.type";

export type TWhereOperator<TEntity> = { operator: IOperator; value: TEntityValue<TEntity> | TEntityValue<TEntity>[] };
