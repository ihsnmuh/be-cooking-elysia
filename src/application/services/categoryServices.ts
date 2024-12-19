import { inject, injectable } from "inversify";
import type { CategoryRepository } from "../../infrastructure/db/categoryRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type { TCreateCategory } from "../../infrastructure/entity/interface";

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

	async getAllByReceiptId(receiptId: string) {
		const category = await this.categoryRepo.getAllByReceiptId(receiptId);
		return category;
	}

	async getOne(categoryId: string) {
		const category = await this.categoryRepo.getOne(categoryId);
		return category;
	}

	async create(data: TCreateCategory) {
		const newCategory = await this.categoryRepo.create(data);
		return newCategory;
	}

	async update(categoryId: string, data: TCreateCategory) {
		const updatedCategory = await this.categoryRepo.update(categoryId, data);
		return updatedCategory;
	}

	async delete(categoryId: string) {
		await this.categoryRepo.delete(categoryId);
	}
}
