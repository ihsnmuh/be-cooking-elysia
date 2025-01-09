import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	ICategory,
	TSortOption,
	TCreateCategory,
	TGetAllParams,
	TUpdateCategory,
} from "../entity/interface";
import { DBError } from "../entity/error";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";

@injectable()
export class CategoryRepository implements ICategory {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	private getSortOptions(
		sort?: TSortOption,
	): Prisma.CategoryOrderByWithRelationInput {
		switch (sort) {
			case "a-z":
				return { name: "asc" };
			case "z-a":
				return { name: "desc" };
			case "newest":
				return { createdAt: "desc" };
			case "latest":
				return { updatedAt: "desc" };

			default:
				return { name: "asc" };
		}
	}

	async getAll(params: TGetAllParams) {
		const { page = 1, limit = 10, sort = "a-z", search } = params || {};

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// sort list
		const order = this.getSortOptions(sort);

		// Get total count for pagination
		const total = await this.prisma.category.count({
			where: {
				name: {
					contains: search,
					mode: "insensitive",
				},
			},
		});

		try {
			const categories = await this.prisma.category.findMany({
				where: {
					name: {
						contains: search,
						mode: "insensitive",
					},
				},
				skip,
				take: +limit,
				orderBy: order,
			});
			return {
				data: categories,
				metadata: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					hasNextPage: skip + categories.length < total,
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

	async getAllByRecipeId(recipeId: string) {
		try {
			const categories = await this.prisma.category.findMany({
				where: {
					recipes: {
						some: {
							id: recipeId,
						},
					},
				},
				orderBy: {
					name: "asc",
				},
			});

			if (!categories) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return categories;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(categoryIdOrName: string) {
		try {
			const category = await this.prisma.category.findFirst({
				where: {
					OR: [
						{
							name: categoryIdOrName,
						},
						{
							id: categoryIdOrName,
						},
					],
				},
			});

			if (!category) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return category;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateCategory) {
		try {
			const newCategory = await this.prisma.category.create({
				data,
			});

			if (!newCategory) {
				throw new DBError("Error creating resource in DB");
			}

			return newCategory;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error creating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(categoryId: string, data: TUpdateCategory) {
		try {
			const updatedCategory = await this.prisma.category.update({
				where: {
					id: categoryId,
				},
				data,
			});

			return updatedCategory;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error updating resource in DB");
			}
			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(categoryId: string) {
		try {
			await this.prisma.category.delete({
				where: {
					id: categoryId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error delete resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
