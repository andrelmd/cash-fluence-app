import dayjs from "dayjs";
import { cameCaseToSnakeCase } from "../../utils/camel-case-to-snake-case";
import { snakeCaseToCamelCase } from "../../utils/snake-case-to-camel-case";

export class DataMapper {
	private dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

	transformToEntity<TEntity>(rawEntity: any): TEntity {
		const entity = {} as TEntity;

		for (const key in rawEntity) {
			if (Object.prototype.hasOwnProperty.call(rawEntity, key)) {
				const camelCaseKey = snakeCaseToCamelCase(key) as keyof TEntity;
				let value = rawEntity[key];

				if (typeof value === "string" && this.dateRegex.test(value)) {
					value = dayjs(value);
				}

				entity[camelCaseKey] = value;
			}
		}
		return entity;
	}

	trasformToRawEntity<TEntity>(entity: TEntity): any {
		const rawEntity = {} as any;

		for (const key in entity) {
			if (Object.prototype.hasOwnProperty.call(entity, key)) {
				const snakeCaseKey = cameCaseToSnakeCase(key) as keyof TEntity;
				let value = entity[key];
				rawEntity[snakeCaseKey] = value;
			}
		}
		return rawEntity;
	}
}
