import { inject, injectable } from "inversify";
import type { RecipeRepository } from "../../infrastructure/db/recipeRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type {
	TCreateRecipeMerge,
	TUpdateRecipeMerge,
} from "../../infrastructure/entity/interface";

@injectable()
export class RecipeServices {
	private recipeRepo: RecipeRepository;
	constructor(@inject(TYPES.recipeRepo) recipeRepo: RecipeRepository) {
		this.recipeRepo = recipeRepo;
	}

	async getAll() {
		const allRecipes = await this.recipeRepo.getAll();
		return allRecipes;
	}

	async getAllByUserId(userId: string) {
		const recipes = await this.recipeRepo.getAllByUserId(userId);
		return recipes;
	}

	async getAllByCategoryId(categoryId: string) {
		const recipes = await this.recipeRepo.getAllByCategoryId(categoryId);
		return recipes;
	}

	async getAllByIngredientId(ingredientId: string) {
		const recipes = await this.recipeRepo.getAllByIngredientId(ingredientId);
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
