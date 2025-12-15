import dayjs from "dayjs"
import { LessThan } from "../../database/operators/query-operators"
import { Logger } from "../../logger/logger.class"
import { LockRepository } from "../entities/lock-repository"

export class LockService {
	constructor(private readonly lockRepository: LockRepository) {}

	async acquireLock(key: string): Promise<boolean> {
		const today = dayjs().startOf("day")
		const newExpiresAt = today.endOf("day")

		const result = await this.lockRepository.upsert({
			conflictTarget: ["key"],
			data: {
				key,
				expiresAt: newExpiresAt,
			},
			where: {
				expiresAt: LessThan(newExpiresAt),
			},
		})

		if (result.rowsAffected > 0) {
			Logger.info(`LockService: Lock for key '${key}' acquired successfully.`)
			return true
		}

		Logger.info(`LockService: Lock for key '${key}' is still valid for today. Not acquiring.`)
		return false
	}
}
