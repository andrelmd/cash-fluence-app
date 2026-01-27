import dayjs, { Dayjs } from "dayjs"
import { TransactionType } from "../constants/transaction-type"

export class Transaction {
	id: number | null
	amount: number
	createDate: Dayjs
	dueDate: Dayjs
	paymentDate: Dayjs | null
	type: TransactionType
	description: string
	currentInstallment: number | null
	installments: number | null
	categoryIds: number[]
	installmentCode: string | null
	paymentMethod: string | null

	constructor({
		amount,
		createDate = dayjs(),
		dueDate,
		paymentDate = null,
		type,
		description,
		categoryIds = [],
		id = null,
		currentInstallment = null,
		installments = null,
		installmentCode = null,
		paymentMethod = null,
	}: {
		amount: number
		dueDate: Dayjs
		description: string
		categoryIds?: number[]
		type: TransactionType
		id?: number | null
		createDate?: Dayjs
		paymentDate?: Dayjs | null
		currentInstallment?: number | null
		installments?: number | null
		installmentCode?: string | null
		paymentMethod?: string | null
	}) {
		this.id = id
		this.amount = amount
		this.createDate = createDate.startOf("day")
		this.type = type
		this.description = description
		this.currentInstallment = currentInstallment
		this.installments = installments
		this.categoryIds = categoryIds
		this.dueDate = dueDate.startOf("day")
		this.paymentDate = paymentDate?.endOf("day") || null
		this.installmentCode = installmentCode || null
		this.paymentMethod = paymentMethod || null
	}
}
