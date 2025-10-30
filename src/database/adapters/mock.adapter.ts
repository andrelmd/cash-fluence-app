import { Transaction } from "../../transactions/classes/transaction";
import { TransactionType } from "../../transactions/constants/transaction-type";
import { DatabaseAdapter } from "../services/database.service";




export class MockAdapter implements DatabaseAdapter {
	async init(): Promise<void> {
		console.log("MockAdapter initialized");
	}

	async find<TData>(options: { table: string, where: Partial<TData> }): Promise<TData[]> {
		let query = `SELECT * FROM ${options.table}`

		const whereKeys = Object.keys(options.where || []).filter((key) => options.where?.[key as keyof typeof options.where] !== undefined) as (keyof typeof options.where)[]
		const whereValues = whereKeys.map((key) => options.where?.[key])

		if (whereKeys.length > 0) {
			query += ' WHERE '
			query += whereKeys.map((key, index) => `${String(key)} = $${index + 1}`).join(' AND ')
			query += ';'
		}
		console.log(query)
		console.log(whereValues)

		const incomeDataSource: Transaction[] = [
			{
				amount: 100,
				category: "Salário",
				date: new Date(),
				description: "Salário",
				id: "1", type: TransactionType.INCOME
			},
			{
				amount: 50,
				category: "Freelance",
				date: new Date(),
				description: "Freelance",
				id: "2", type: TransactionType.INCOME
			},
			{
				amount: 2000,
				category: "Outros",
				date: new Date(),
				description: "Outros",
				id: "3", type: TransactionType.INCOME
			}
		];

		const expenseDataSource: Transaction[] = [
			{
				amount: 100,
				category: "Alimentação",
				date: new Date(),
				description: "Alimentação",
				id: "4", type: TransactionType.EXPENSE
			},
			{
				amount: 50,
				category: "Transporte",
				date: new Date(),
				description: "Transporte",
				id: "5", type: TransactionType.EXPENSE
			},
			{
				amount: 2000,
				category: "Outros",
				date: new Date(),
				description: "Outros",
				id: "6", type: TransactionType.EXPENSE
			}
		];

		const allDataSource = [...incomeDataSource, ...expenseDataSource]
		const timeout = 1000 + Math.random() * 2000

		const result = await new Promise<TData[]>((resolve) => {
			if (!whereKeys.includes('type' as keyof typeof options.where)) return setTimeout(() => {
				resolve(allDataSource as unknown as TData[])
			}, timeout);
			const type = whereKeys.indexOf('type' as keyof typeof options.where)
			if (type === TransactionType.INCOME) {
				setTimeout(() => {

					resolve(incomeDataSource as unknown as TData[])
				}, timeout)
			} else if (type === TransactionType.EXPENSE) {
				setTimeout(() => {

					resolve(expenseDataSource as unknown as TData[])
				}, timeout);
			} else {
				setTimeout(() => {

					resolve(allDataSource as unknown as TData[])
				}, timeout);
			}
		})
		return result
	}


}