import { Category } from "../entities/Category";
import { CategoryRepository } from "../entities/category-repository";

export class CategoryService {
	private repository: CategoryRepository;

	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async getAll() {
		return this.repository.getAll();
	}

	async save(category: Category) {
		const result = await this.repository.save({ data: category });
		const newCategory = await this.repository.getOne({ where: { id: result.lastInsertId } });

		if (!newCategory) {
			throw new Error("Category not found");
		}

		return newCategory;
	}
}
