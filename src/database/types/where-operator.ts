import { IOperator } from "../interfaces/operators-sql"
import { TEntityValue } from "./entity-value"

export type TWhereOperator<TEntity> = { operator: IOperator; value: TEntityValue<TEntity> | TEntityValue<TEntity>[] }
