import database from "../../database/database";
import { Transaction } from "../classes/transaction";

export function deleteTransaction(id: number) {
	return database.delete<Transaction>({ table: "transactions", where: { id } });
}
