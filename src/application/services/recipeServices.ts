import { inject, injectable } from "inversify";
import type { RecipeRepository } from "../../infrastructure/db/recipeRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type {
	TCreateRecipeMerge,
	TGetAllParams,
	TUpdateRecipeMerge,
} from "../../infrastructure/entity/interface";

@injectable()
export class RecipeServices {
	private recipeRepo: RecipeRepository;
	constructor(@inject(TYPES.recipeRepo) recipeRepo: RecipeRepository) {
		this.recipeRepo = recipeRepo;
	}

	async getAll(params: TGetAllParams) {
		const allRecipes = await this.recipeRepo.getAll(params);
		return allRecipes;
	}

	async getAllByUserId(userId: string, params: TGetAllParams) {
		const recipes = await this.recipeRepo.getAllByUserId(userId, params);
		return recipes;
	}

	async getAllByCategoryId(categoryId: string, params: TGetAllParams) {
		const recipes = await this.recipeRepo.getAllByCategoryId(
			categoryId,
			params,
		);
		return recipes;
	}

	async getAllByIngredientId(ingredientId: string, params: TGetAllParams) {
		const recipes = await this.recipeRepo.getAllByIngredientId(
			ingredientId,
			params,
		);
		return recipes;
	}

	async getOne(recipeId: string) {
		const recipe = await this.recipeRepo.getOne(recipeId);
		return recipe;
	}

	async create(data: TCreateRecipeMerge) {
		const newRecipe = await this.recipeRepo.create(data);
		return newRecipe;
	}

	async update(recipeId: string, data: TUpdateRecipeMerge) {
		const updatedRecipe = await this.recipeRepo.update(recipeId, data);
		return updatedRecipe;
	}

	async delete(recipeId: string, userId: string) {
		await this.recipeRepo.delete(recipeId, userId);
	}
}
