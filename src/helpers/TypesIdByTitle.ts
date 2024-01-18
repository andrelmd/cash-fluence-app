import { transactionTypeEntities } from "../configurations/DatabaseManager";
export const typesIdByTitle = new Map<string, number>();

transactionTypeEntities.forEach((transactionTypeEntity) => {
  typesIdByTitle.set(transactionTypeEntity.title, transactionTypeEntity.id);
});
