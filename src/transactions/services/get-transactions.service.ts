import dayjs from "dayjs";
import database from "../../database/database";
import { Transaction } from "../classes/transaction";
import { TransactionType } from "../constants/transaction-type";

export async function getTransactions(type?: TransactionType): Promise<Transaction[]> {
	const startOfThisMonth = dayjs().startOf("month").toISOString();
	const endOfThisMonth = dayjs().endOf("month").toISOString();

	const transaction = await database.find<Transaction>({
		table: "transactions",
		where: { type, date: [startOfThisMonth, endOfThisMonth] },
	});
	return transaction;
}
