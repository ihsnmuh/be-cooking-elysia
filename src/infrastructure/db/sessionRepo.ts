import { Prisma, type PrismaClient } from "@prisma/client";
import type { ISession } from "../entity/interface";
import "reflect-metadata";
import { TYPES } from "../entity/type";
import { inject, injectable } from "inversify";
import { DBError } from "../entity/error";

@injectable()
export class SessionRepository implements ISession {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getOne(sessionId: string) {
		try {
			const session = await this.prisma.session.findUnique({
				where: {
					id: sessionId,
				},
			});

			if (!session) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return session;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(userId: string) {
		try {
			const createSession = await this.prisma.session.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
				},
			});

			return createSession;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(sessionId: string) {
		try {
			await this.prisma.session.delete({
				where: {
					id: sessionId,
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
