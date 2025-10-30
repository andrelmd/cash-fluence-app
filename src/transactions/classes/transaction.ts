import { Dayjs } from "dayjs";
import { TransactionType } from "../constants/transaction-type";

export class Transaction {
	id?: string;
	amount: number;
	date: Dayjs;
	type: TransactionType;
	description: string;



	constructor({ amount, category, date, id, type, description }: {
		id?: string,
		amount: number,
		date: Dayjs,
		type: TransactionType,
		category: string,
		description: string,
	}) {
		this.id = id;
		this.amount = amount;
		this.date = date;
		this.type = type;
		this.description = description;
	}

}