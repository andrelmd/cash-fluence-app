export interface EntryTypeInterface {
  id: number;
  name: string;
}

export class EntryType {
  id: number;
  name: string;

  constructor(entryTypeInterface: EntryTypeInterface) {
    this.id = entryTypeInterface.id;
    this.name = entryTypeInterface.name;
  }
}
