export interface EntryInterface {
  id: number
  value: number
  name: string
  entry_type_id: number
  created_at: string
}
export class Entry {
  id?: number
  value: number = 0
  name: string = ''
  entryTypeId: number = 0
  createdAt = new Date()

  constructor(entry: EntryInterface | Partial<Entry>) {
    if ('entryTypeId' in entry) {
      if (entry.id) this.id = entry.id
      if (entry.value) this.value = entry.value
      else throw new Error('Entry value is required')
      if (entry.name) this.name = entry.name
      else throw new Error('Entry name is required')
      if (entry.entryTypeId) this.entryTypeId = entry.entryTypeId
      else throw new Error('Entry type is required')
      if (entry.createdAt) this.createdAt = new Date(entry.createdAt)
    } else if ('entry_type_id' in entry) {
      this.id = entry.id
      this.value = entry.value
      this.name = entry.name
      this.entryTypeId = entry.entry_type_id
      if (entry.created_at) this.createdAt = new Date(entry.created_at)
    }
  }
}
