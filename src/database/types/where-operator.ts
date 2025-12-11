import { SqlOperators } from "../constants/sql-operators"
import { TEntityValue } from "./entity-value"

export type TWhereOperator<TEntity> = { operator: SqlOperators; value: TEntityValue<TEntity> | TEntityValue<TEntity>[] }
