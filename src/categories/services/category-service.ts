import { IEntityServiceGetAll } from "@/interfaces/entity-service-get-all";
import { IEntityServiceSave } from "@/interfaces/entity-service-save";
import { IEntityServiceUpdate } from "@/interfaces/entity-service-update";
import { IEntityServiceDelete } from "../../interfaces/entity-service-delete";
import { Category } from "../entities/Category";
import { CategoryRepository } from "../entities/category-repository";

export class CategoryService
	implements IEntityServiceGetAll<Category>, IEntityServiceSave<Category>, IEntityServiceUpdate<Category>, IEntityServiceDelete<Category>
{
	private repository: CategoryRepository;

	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async getAll() {
		return this.repository.getMany();
	}

	async save(category: Category) {
		const result = await this.repository.save({ data: category });
		const newCategory = await this.repository.getOne({ where: { id: result.lastInsertId } });

		if (!newCategory) {
			throw new Error("Category not found");
		}

		return newCategory;
	}

	async update(category: Category) {
		if (!category.id) throw new Error("Category id is required");
		await this.repository.update({ data: category });
		const updatedCategory = await this.repository.getOne({ where: { id: category.id } });

		if (!updatedCategory) {
			throw new Error("Category not found");
		}

		return updatedCategory;
	}

	async delete(category: Category) {
		await this.repository.delete({ where: { id: category.id } });
	}
}
