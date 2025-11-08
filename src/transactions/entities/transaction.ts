import { Dayjs } from "dayjs";
import { TransactionType } from "../constants/transaction-type";

export class Transaction {
	id?: number;
	amount: number;
	createDate: Dayjs;
	type: TransactionType;
	description: string;
	currentInstallment: number;
	installments: number;
	categoryId: number;

	constructor({
		amount,
		createDate,
		id,
		type,
		description,
		currentInstallment,
		installments,
		categoryId,
	}: {
		id?: number;
		amount: number;
		createDate: Dayjs;
		type: TransactionType;
		description: string;
		currentInstallment: number;
		installments: number;
		categoryId: number;
	}) {
		this.id = id;
		this.amount = amount;
		this.createDate = createDate;
		this.type = type;
		this.description = description;
		this.currentInstallment = currentInstallment;
		this.installments = installments;
		this.categoryId = categoryId;
	}
}
