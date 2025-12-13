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
	categoryId: number
	installmentCode: string | null

	constructor({
		amount,
		createDate = dayjs(),
		dueDate,
		paymentDate = null,
		type,
		description,
		categoryId,
		id = null,
		currentInstallment = null,
		installments = null,
		installmentCode = null,
	}: {
		amount: number
		dueDate: Dayjs
		description: string
		categoryId: number
		type: TransactionType
		id?: number | null
		createDate?: Dayjs
		paymentDate?: Dayjs | null
		currentInstallment?: number | null
		installments?: number | null
		installmentCode?: string | null
	}) {
		this.id = id
		this.amount = amount
		this.createDate = createDate.startOf("day")
		this.type = type
		this.description = description
		this.currentInstallment = currentInstallment
		this.installments = installments
		this.categoryId = categoryId
		this.dueDate = dueDate.startOf("day")
		this.paymentDate = paymentDate?.endOf("day") || null
		this.installmentCode = installmentCode || null
	}
}
