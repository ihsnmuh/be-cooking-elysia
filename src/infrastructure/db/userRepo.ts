import { Prisma, type PrismaClient } from "@prisma/client";
import type { IUser, TCreateUser, TUpdateUser } from "../entity/interface";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/type";
import { DBError } from "../entity/error";

@injectable()
export class UserRepository implements IUser {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const users = await this.prisma.user.findMany();
			return users;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(userIdOrEmail: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					OR: [
						{
							id: userIdOrEmail,
						},
						{
							email: userIdOrEmail,
						},
					],
				},
			});

			if (!user) {
				return null;
			}

			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateUser) {
		try {
			const newUser = await this.prisma.user.create({
				data,
			});

			if (!newUser) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return newUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(idUser: string, data: TUpdateUser) {
		try {
			const updateUser = await this.prisma.user.update({
				where: {
					id: idUser,
				},
				data,
			});

			if (!updateUser) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return updateUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(idUser: string) {
		try {
			await this.prisma.user.delete({
				where: {
					id: idUser,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
