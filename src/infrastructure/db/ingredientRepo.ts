import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	IIngredient,
	TCreateIngredient,
	TUpdateIngredient,
} from "../entity/interface";
import { TYPES } from "../entity/type";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { DBError } from "../entity/error";

@injectable()
export class IngredientRepository implements IIngredient {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const ingredients = await this.prisma.ingredient.findMany();
			return ingredients;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByRecipeId(recipeId: string) {
		try {
			const ingredients = await this.prisma.ingredient.findMany({
				where: {
					recipes: {
						some: {
							id: recipeId,
						},
					},
				},
			});

			if (!ingredients) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return ingredients;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(ingredientIdOrName: string) {
		try {
			const ingredient = await this.prisma.ingredient.findFirst({
				where: {
					OR: [
						{
							name: ingredientIdOrName,
						},
						{
							id: ingredientIdOrName,
						},
					],
				},
			});

			if (!ingredient) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return ingredient;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateIngredient) {
		try {
			const ingredient = await this.prisma.ingredient.create({
				data,
			});

			if (!ingredient) {
				throw new DBError("Error creating resource in DB");
			}

			return ingredient;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error creating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(ingredientId: string, data: TUpdateIngredient) {
		try {
			const ingredient = await this.prisma.ingredient.update({
				where: {
					id: ingredientId,
				},
				data,
			});

			return ingredient;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error updating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(ingredientId: string) {
		try {
			await this.prisma.ingredient.delete({
				where: {
					id: ingredientId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error updating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
