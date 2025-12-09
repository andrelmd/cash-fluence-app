import dayjs, { Dayjs } from "dayjs"
import { Tables } from "../../database/constants/tables"
import { DatabaseService } from "../../database/services/database-service"
import { Logger } from "../../logger/logger.class"

export class LockService {
	constructor(private readonly databaseService: DatabaseService) {}

	async acquireLock(key: string): Promise<boolean> {
		const today = dayjs()
		let success = false

		await this.databaseService.transaction(async () => {
			const existingLock = await this.databaseService.findOne<{ key: string; expiresAt: Dayjs }>({
				table: Tables.LOCKS,
				where: { key },
			})

			const newExpiresAt = today.endOf("day")

			if (!existingLock) {
				Logger.log(`LockService: No lock found for key '${key}'. Acquiring for the first time.`)
				await this.databaseService.save({ table: Tables.LOCKS, data: { key, expiresAt: newExpiresAt } })
				success = true
				return
			}

			if (today.isAfter(existingLock.expiresAt)) {
				Logger.log(`LockService: Existing lock for key '${key}' has expired. Acquiring for a new day.`)
				await this.databaseService.update<{ key: string; expiresAt: Dayjs }>({
					table: Tables.LOCKS,
					where: { key },
					data: { expiresAt: newExpiresAt },
				})
				success = true
			}

			Logger.log(`LockService: Lock for key '${key}' is still valid for today. Not acquiring.`)
			return
		})
		return success
	}
}
