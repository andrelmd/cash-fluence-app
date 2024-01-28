export class TransactionEntity {
  id: number;
  title: string;
  categoryId: number;
  typeId: number;
  value: number;
  date: Date;

  constructor(partial: Partial<TransactionEntity>) {
    this.id = partial.id ?? 0;
    this.title = partial.title ?? "";
    this.categoryId = partial.categoryId ?? 0;
    this.typeId = partial.typeId ?? 0;
    this.value = partial.value ?? 0;
    this.date = partial.date ?? new Date();
  }
}
