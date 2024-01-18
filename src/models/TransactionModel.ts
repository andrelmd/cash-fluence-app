import { TransactionClass } from "../classes/Transaction";
import Logger from "../helpers/Logger";

export class TransactionModel {
  id?: number;
  title: string;
  category_id: number;
  type_id: number;
  value: number;
  date: string;
  constructor(entity: TransactionModel | Partial<TransactionClass>) {
    Logger.debug(
      `TransactionModel.ts - constructor - debug: ${JSON.stringify(entity)}`,
    );
    if ("categoryId" in entity) {
      if (!entity.title) throw new Error("Transaction title is required");
      if (!entity.categoryId)
        throw new Error("Transaction category is required");
      if (!entity.typeId) throw new Error("Transaction type is required");
      if (!entity.value) throw new Error("Transaction value is required");
      if (!entity.date) throw new Error("Transaction date is required");
      this.id = entity.id;
      this.title = entity.title;
      this.category_id = entity.categoryId;
      this.type_id = entity.typeId;
      this.value = entity.value;
      this.date =
        entity.date instanceof Date
          ? entity.date.toISOString()
          : new Date(entity.date).toISOString();
    } else {
      this.id = entity.id;
      this.title = entity.title;
      this.category_id = entity.category_id;
      this.type_id = entity.type_id;
      this.value = entity.value;
      this.date = entity.date;
    }
  }
}
