export class Planning {
	id?: number
	amount: number
	categoryId: number
	month: number
	year: number

	constructor({
		amount,
		categoryId,
		month,
		year,
		id,
	}: {
		amount: number
		categoryId: number
		month: number
		year: number
		id?: number
	}) {
		this.amount = amount
		this.categoryId = categoryId
		this.month = month
		this.year = year
		this.id = id
	}
}
