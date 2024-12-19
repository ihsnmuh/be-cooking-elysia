import { Prisma, type PrismaClient } from "@prisma/client";
import type { ICategory, TCreateCategory } from "../entity/interface";
import { DBError } from "../entity/error";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";
import { t } from "elysia";

@injectable()
export class CategoryRepository implements ICategory {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.categoryRepo) prisma: PrismaClient) {
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

	async getAllByReceiptId(receiptId: string) {
		try {
			const categories = await this.prisma.category.findMany({
				where: {
					receipts: {
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

	async getOne(categoryId: string) {
		try {
			const category = await this.prisma.category.findUnique({
				where: {
					id: categoryId,
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

	async update(categoryId: string, data: TCreateCategory) {
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
