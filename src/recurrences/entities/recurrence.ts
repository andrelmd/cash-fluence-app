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
		amount: number
		dueDate: Dayjs
		type: TransactionType
		description: string
		categoryId: number
		id?: number | null
		createDate?: Dayjs
		nextExecutionDate?: Dayjs
	}) {
		this.id = id
		this.amount = amount
		this.createDate = createDate
		this.type = type
		this.description = description
		this.categoryId = categoryId
		this.dueDate = dueDate.startOf("day")
		this.nextExecutionDate = nextExecutionDate.startOf("day")
	}
}
