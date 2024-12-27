import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { CategoryRepository } from "../../infrastructure/db/categoryRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type {
	TCreateCategory,
	TUpdateCategory,
} from "../../infrastructure/entity/interface";

@injectable()
export class CategoryServices {
	private categoryRepo: CategoryRepository;

	constructor(@inject(TYPES.categoryRepo) categoryRepo: CategoryRepository) {
		this.categoryRepo = categoryRepo;
	}

	async getAll() {
		const allCategories = await this.categoryRepo.getAll();
		return allCategories;
	}

	async getAllByRecipeId(recipeId: string) {
		const categories = await this.categoryRepo.getAllByRecipeId(recipeId);
		return categories;
	}

	async getOne(categoryIdOrName: string) {
		const category = await this.categoryRepo.getOne(categoryIdOrName);
		return category;
	}

	async create(data: TCreateCategory) {
		const newCategory = await this.categoryRepo.create(data);
		return newCategory;
	}

	async update(categoryId: string, data: TUpdateCategory) {
		const updatedCategory = await this.categoryRepo.update(categoryId, data);
		return updatedCategory;
	}

	async delete(categoryId: string) {
		await this.categoryRepo.delete(categoryId);
	}
}
