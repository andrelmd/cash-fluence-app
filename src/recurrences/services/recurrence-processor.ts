import dayjs from "dayjs"
import { LessThanOrEqual } from "../../database/operators/query-operators"
import { Logger } from "../../logger/logger.class"
import { Transaction } from "../../transactions/entities/transaction"
import { TransactionsService } from "../../transactions/services/transactions-service"
import { RecurrencesService } from "./recurrences-service"

export class RecurrenceProcessor {
	constructor(
		private readonly recurrencesService: RecurrencesService,
		private readonly transactionsService: TransactionsService
	) {}
	async processRecurrences() {
		const today = dayjs().endOf("day")
		const recurrences = await this.recurrencesService.getMany({
			where: { nextExecutionDate: LessThanOrEqual(today) },
		})
		for await (const recurrence of recurrences) {
			const { amount, categoryId, description, dueDate, type, id } = recurrence

			if (!id) {
				Logger.error("Recurrence id is null")
				return
			}

			const originalDueDay = dayjs(dueDate).get("date")
			const daysInCurrentMonth = today.daysInMonth()

			const newDueDay = Math.min(originalDueDay, daysInCurrentMonth)
			const newDueDate = today.clone().set("date", newDueDay)

			const newTransaction = new Transaction({
				amount,
				categoryId,
				createDate: today,
				description,
				dueDate: newDueDate,
				type,
				currentInstallment: null,
				installments: null,
				paymentDate: null,
				id: null,
			})
			await this.transactionsService.save(newTransaction)
			await this.recurrencesService.updateNextExecutionDate(id)
		}
	}
}
