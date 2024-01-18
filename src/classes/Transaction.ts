import { TransactionModel } from "../models/TransactionModel";
import Logger from "../helpers/Logger";

export class TransactionClass {
  id?: number;
  title?: string;
  categoryId?: number;
  typeId?: number;
  value?: number;
  date?: Date;

  constructor(entity: TransactionModel | Partial<TransactionClass>) {
    Logger.debug(
      `Transaction.ts - constructor - debug: ${JSON.stringify(entity)}`,
    );
    if (entity instanceof TransactionModel) {
      this.id = entity.id;
      this.title = entity.title;
      this.categoryId = entity.category_id;
      this.typeId = entity.type_id;
      this.value = entity.value;
      this.date = new Date(entity.date);
      if (isNaN(this.date.getTime())) throw new Error("Invalid date");
    } else {
      this.id = entity.id;
      this.title = entity.title;
      this.categoryId = entity.categoryId;
      this.typeId = entity.typeId;
      this.value = entity.value;
      this.date = entity.date;
    }
  }
}
