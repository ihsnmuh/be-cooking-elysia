import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	IRecipe,
	TCreateRecipeMerge,
	TGetAllParams,
	TSortOption,
	TUpdateRecipeMerge,
} from "../entity/interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";
import { DBError } from "../entity/error";
import { NotFoundError } from "elysia";

@injectable()
export class RecipeRepository implements IRecipe {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	private getSortOptions(
		sort?: TSortOption,
	): Prisma.RecipeOrderByWithRelationInput {
		switch (sort) {
			case "a-z":
				return { title: "asc" };
			case "z-a":
				return { title: "desc" };
			case "newest":
				return { createdAt: "desc" };
			case "latest":
				return { updatedAt: "desc" };

			default:
				return { title: "asc" };
		}
	}

	async getAll(params: TGetAllParams) {
		const { page = 1, limit = 10, sort = "a-z", search } = params || {};

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// sort list
		const order = this.getSortOptions(sort);

		const where = search
			? {
					OR: [
						{
							title: { contains: search, mode: Prisma.QueryMode.insensitive },
						},
						{
							description: {
								contains: search,
								mode: Prisma.QueryMode.insensitive,
							},
						},
					],
				}
			: {};

		// Get total count for pagination
		const total = await this.prisma.recipe.count({
			where,
		});

		try {
			const recipes = await this.prisma.recipe.findMany({
				where,
				skip,
				take: +limit,
				orderBy: order,
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
			return {
				data: recipes,
				metadata: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					hasNextPage: skip + recipes.length < total,
					hasPreviousPage: page > 1,
				},
			};
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByUserId(userId: string, params: TGetAllParams) {
		const { page = 1, limit = 10, sort = "a-z", search } = params || {};

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// sort list
		const order = this.getSortOptions(sort);

		const where = search
			? {
					AND: {
						userId: userId,
						OR: [
							{
								title: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
							{
								description: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
						],
					},
				}
			: {
					userId: userId,
				};

		// Get total count for pagination
		const total = await this.prisma.recipe.count({
			where,
		});

		try {
			const recipes = await this.prisma.recipe.findMany({
				where,
				skip,
				take: +limit,
				orderBy: order,
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

			return {
				data: recipes,
				metadata: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					hasNextPage: skip + recipes.length < total,
					hasPreviousPage: page > 1,
				},
			};
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByCategoryId(categoryId: string, params: TGetAllParams) {
		const { page = 1, limit = 10, sort = "a-z", search } = params || {};

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// sort list
		const order = this.getSortOptions(sort);

		const where = search
			? {
					AND: {
						categories: {
							some: {
								categoryId: categoryId,
							},
						},
						OR: [
							{
								title: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
							{
								description: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
						],
					},
				}
			: {
					categories: {
						some: {
							categoryId: categoryId,
						},
					},
				};

		// Get total count for pagination
		const total = await this.prisma.recipe.count({
			where,
		});

		try {
			const recipes = await this.prisma.recipe.findMany({
				where,
				skip,
				take: +limit,
				orderBy: order,
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

			return {
				data: recipes,
				metadata: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					hasNextPage: skip + recipes.length < total,
					hasPreviousPage: page > 1,
				},
			};
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByIngredientId(ingredientId: string, params: TGetAllParams) {
		const { page = 1, limit = 10, sort = "a-z", search } = params || {};

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// sort list
		const order = this.getSortOptions(sort);

		const where = search
			? {
					AND: {
						ingredients: {
							some: {
								ingredientId: ingredientId,
							},
						},
						OR: [
							{
								title: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
							{
								description: {
									contains: search,
									mode: Prisma.QueryMode.insensitive,
								},
							},
						],
					},
				}
			: {
					ingredients: {
						some: {
							ingredientId: ingredientId,
						},
					},
				};

		// Get total count for pagination
		const total = await this.prisma.recipe.count({
			where,
		});

		try {
			const recipes = await this.prisma.recipe.findMany({
				where,
				skip,
				take: +limit,
				orderBy: order,
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

			return {
				data: recipes,
				metadata: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					hasNextPage: skip + recipes.length < total,
					hasPreviousPage: page > 1,
				},
			};
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
				throw new NotFoundError("Recipe not found");
			}

			return recipe;
		} catch (error) {
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
