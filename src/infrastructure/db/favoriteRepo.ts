import { Prisma, type PrismaClient } from "@prisma/client";
import type { IFavorite, TCreateFavorite } from "../entity/interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";
import { DBError } from "../entity/error";
import "reflect-metadata";

@injectable()
export class FavoriteRepository implements IFavorite {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAllByUserId(userId: string) {
		try {
			const favorites = await this.prisma.favorite.findMany({
				where: {
					userId: userId,
				},
				include: {
					recipe: {
						select: {
							id: true,
							title: true,
							description: true,
							cookingTime: true,
							imageUrl: true,
							servings: true,
						},
					},
					user: {
						select: {
							id: true,
							name: true,
							username: true,
						},
					},
				},
			});

			return favorites;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateFavorite) {
		try {
			const favorite = await this.prisma.favorite.create({
				data,
			});

			if (!favorite) {
				throw new DBError("Error creating resource in DB");
			}

			return favorite;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error creating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(favoriteId: string, userId: string) {
		try {
			await this.prisma.favorite.delete({
				where: {
					id: favoriteId,
					userId: userId,
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
