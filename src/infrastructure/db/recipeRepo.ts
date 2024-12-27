import { Prisma, Recipe, type PrismaClient } from "@prisma/client";
import type {
	IRecipe,
	TCreateRecipeMerge,
	TUpdateRecipeMerge,
} from "../entity/interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";
import { DBError } from "../entity/error";

@injectable()
export class RecipeRepository implements IRecipe {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const recipes = await this.prisma.recipe.findMany({
				include: {
					categories: {
						select: {
							id: true,
							category: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					ingredients: {
						select: {
							id: true,
							quantity: true,
							unit: true,
							ingredient: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatar: true,
						},
					},
				},
			});
			return recipes;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByUserId(userId: string) {
		try {
			const recipes = await this.prisma.recipe.findMany({
				where: {
					userId: userId,
				},
				include: {
					categories: {
						select: {
							id: true,
							category: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					ingredients: {
						select: {
							id: true,
							quantity: true,
							unit: true,
							ingredient: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatar: true,
						},
					},
				},
			});

			if (!recipes) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return recipes;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByCategoryId(categoryId: string) {
		try {
			const recipes = await this.prisma.recipe.findMany({
				where: {
					categories: {
						some: {
							categoryId: categoryId,
						},
					},
				},
				include: {
					categories: {
						select: {
							id: true,
							category: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					ingredients: {
						select: {
							id: true,
							quantity: true,
							unit: true,
							ingredient: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatar: true,
						},
					},
				},
			});

			if (!recipes) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return recipes;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByIngredientId(ingredientId: string) {
		try {
			const recipes = await this.prisma.recipe.findMany({
				where: {
					ingredients: {
						some: {
							ingredientId: ingredientId,
						},
					},
				},
				include: {
					categories: {
						select: {
							id: true,
							category: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					ingredients: {
						select: {
							id: true,
							quantity: true,
							unit: true,
							ingredient: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatar: true,
						},
					},
				},
			});

			if (!recipes) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return recipes;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(recipeId: string) {
		try {
			const recipe = await this.prisma.recipe.findUnique({
				where: {
					id: recipeId,
				},
				include: {
					categories: {
						select: {
							id: true,
							category: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					ingredients: {
						select: {
							id: true,
							quantity: true,
							unit: true,
							ingredient: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					instructions: {
						select: {
							id: true,
							stepNumber: true,
							text: true,
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatar: true,
						},
					},
				},
			});

			if (!recipe) {
				throw new DBError("Recipe not found");
			}

			return recipe;
		} catch (error) {
			console.log("🚀 ~ RecipeRepository ~ getOne ~ error:", error);
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateRecipeMerge) {
		try {
			const newRecipe = await this.prisma.recipe.create({
				data: {
					title: data.title,
					description: data.description,
					userId: data.userId,
					imageUrl: data.imageUrl ?? "",
					servings: data.servings,
					cookingTime: data.cookingTime,
					categories: {
						create: data.categories.map((category) => ({
							category: {
								connect: {
									id: category.id,
								},
							},
						})),
					},
					ingredients: {
						create: data.ingredients.map((ingredient) => ({
							quantity: ingredient.quantity,
							unit: ingredient.unit,
							ingredient: {
								connect: {
									id: ingredient.ingredientId,
								},
							},
						})),
					},
					instructions: {
						create: data.instructions.map((instruction) => ({
							text: instruction.text,
							stepNumber: instruction.stepNumber,
						})),
					},
				},
				include: {
					categories: true,
					ingredients: {
						include: {
							ingredient: true,
						},
					},
					instructions: true,
				},
			});

			if (!newRecipe) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return newRecipe;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(`Prisma error: ${error.message}`);
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(recipeId: string, data: TUpdateRecipeMerge) {
		try {
			const updatedRecipe = await this.prisma.recipe.update({
				where: {
					id: recipeId,
				},
				data: {
					title: data.title,
					description: data.description,
					imageUrl: data.imageUrl,
					servings: data.servings,
					userId: data.userId,
					cookingTime: data.cookingTime,
					categories: {
						update: data.categories.map((category) => ({
							where: {
								id: category.id,
							},
							data: {
								category: {
									connect: {
										id: category.categoryId,
									},
								},
							},
						})),
					},
					ingredients: {
						update: data.ingredients.map((ingredient) => ({
							where: {
								id: ingredient.id,
							},
							data: {
								quantity: ingredient.quantity,
								unit: ingredient.unit,
								ingredient: {
									connect: {
										id: ingredient.ingredientId,
									},
								},
							},
						})),
					},
					instructions: {
						update: data.instructions.map((instruction) => ({
							where: {
								id: instruction.id,
							},
							data: {
								text: instruction.text,
								stepNumber: instruction.stepNumber,
							},
						})),
					},
				},
				include: {
					categories: true,
					ingredients: {
						include: {
							ingredient: true,
						},
					},
					instructions: true,
				},
			});

			if (!updatedRecipe) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return updatedRecipe;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(recipeId: string, userId: string) {
		try {
			await this.prisma.recipe.delete({
				where: {
					id: recipeId,
				},
			});
		} catch (error) {
			console.log("🚀 ~ RecipeRepository ~ delete ~ error:", error);
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
