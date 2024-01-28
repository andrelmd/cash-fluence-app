export class CategoryEntity {
  id: number;
  title: string;

  constructor(partial: Partial<CategoryEntity>) {
    this.id = partial.id ?? 0;
    this.title = partial.title ?? "";
  }
}
