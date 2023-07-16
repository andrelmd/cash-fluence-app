export interface ITransaction {
  id: number
  value: number
  name: string
  transaction_type_id: number
  date: string
}
export class Transaction {
  id?: number
  value: number
  name: string
  transactioTypeId: number
  date: Date

  constructor(transaction: ITransaction) {
    if (transaction.id) this.id = transaction.id
    this.value = transaction.value
    this.name = transaction.name
    this.transactioTypeId = transaction.transaction_type_id
    this.date = new Date(transaction.date)
  }
}
