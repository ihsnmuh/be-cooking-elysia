import { inject, injectable } from "inversify";
import type { IngredientRepository } from "../../infrastructure/db/ingredientRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type {
	TCreateIngredient,
	TUpdateIngredient,
} from "../../infrastructure/entity/interface";

@injectable()
export class IngredientService {
	private ingredientRepo: IngredientRepository;

	constructor(
		@inject(TYPES.ingredientRepo) ingredientRepo: IngredientRepository,
	) {
		this.ingredientRepo = ingredientRepo;
	}

	async getAll() {
		const allIngredients = await this.ingredientRepo.getAll();
		return allIngredients;
	}

	async getAllByRecipeId(recipeId: string) {
		const ingredients = await this.ingredientRepo.getAllByRecipeId(recipeId);
		return ingredients;
	}

	async getOne(ingredientIdOrName: string) {
		const ingredient = await this.ingredientRepo.getOne(ingredientIdOrName);
		return ingredient;
	}

	async create(data: TCreateIngredient) {
		const newIngredient = await this.ingredientRepo.create(data);
		return newIngredient;
	}

	async update(ingredientId: string, data: TUpdateIngredient) {
		const updatedIngredient = await this.ingredientRepo.update(
			ingredientId,
			data,
		);
		return updatedIngredient;
	}

	async delete(ingredientId: string) {
		await this.ingredientRepo.delete(ingredientId);
	}
}
