import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	ICategory,
	TCreateCategory,
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

	async getAll() {
		try {
			const categories = await this.prisma.category.findMany();
			return categories;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByRecipeId(receiptId: string) {
		try {
			const categories = await this.prisma.category.findMany({
				where: {
					recipes: {
						some: {
							id: receiptId,
						},
					},
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
				throw new DBError("Error updating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}