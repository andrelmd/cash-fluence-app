export interface EntryInterface {
  id: number;
  value: number;
  name: string;
  entry_type_id: number;
  created_at: string;
}
export class Entry {
  id: number;
  value: number;
  name: string;
  entryTypeId: number;
  createdAt: Date;

  constructor(entry: EntryInterface) {
    this.id = entry.id;
    this.value = entry.value;
    this.name = entry.name;
    this.entryTypeId = entry.entry_type_id;
    this.createdAt = new Date(entry.created_at);
  }
}
