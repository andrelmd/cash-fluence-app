import dayjs, { Dayjs } from "dayjs"
import { TransactionType } from "../../transactions/constants/transaction-type"

export class Recurrence {
	id: number | null
	description: string
	amount: number
	type: TransactionType
	createDate: Dayjs
	dueDate: Dayjs
	nextExecutionDate: Dayjs
	categoryId: number

	constructor({
		amount,
		createDate = dayjs(),
		dueDate,
		type,
		description,
		categoryId,
		id = null,
		nextExecutionDate = dayjs().add(1, "month").startOf("month").startOf("day"),
	}: {
		id: number | null
		amount: number
		createDate?: Dayjs
		dueDate: Dayjs
		type: TransactionType
		description: string
		categoryId: number
		nextExecutionDate?: Dayjs
	}) {
		this.id = id
		this.amount = amount
		this.createDate = createDate
		this.type = type
		this.description = description
		this.categoryId = categoryId
		this.dueDate = dueDate
		this.nextExecutionDate = nextExecutionDate
	}
}
