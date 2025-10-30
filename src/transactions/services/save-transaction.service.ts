import database from "../../database/database";
import { Transaction } from "../classes/transaction";

export async function saveTransactions(entity: Transaction): Promise<Transaction | null> {
	const result = await database.save<Transaction>({ table: "transactions", data: entity });
	const transaction = await database.findOne<Transaction>({ table: "transactions", where: { id: result.lastInsertId } });
	return transaction;
}
