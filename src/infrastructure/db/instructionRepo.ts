import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	IInstruction,
	TCreateInstruction,
	TUpdateInstruction,
} from "../entity/interface";
import { DBError } from "../entity/error";
import { inject, injectable } from "inversify";
import { TYPES } from "../entity/type";

@injectable()
export class InstructionRepository implements IInstruction {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const instructions = await this.prisma.instruction.findMany();
			return instructions;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getAllByRecipeId(recipeId: string) {
		try {
			const instructions = await this.prisma.instruction.findMany({
				where: {
					recipeId: recipeId,
				},
				orderBy: {
					stepNumber: "asc",
				},
			});

			if (!instructions) {
				throw new DBError("Something went wrong while doing DB operation");
			}

			return instructions;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(instructionId: string) {
		try {
			const instruction = await this.prisma.instruction.findUnique({
				where: {
					id: instructionId,
				},
			});

			if (!instruction) {
				throw new DBError("Instruction not found");
			}

			return instruction;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: TCreateInstruction) {
		try {
			const instruction = await this.prisma.instruction.create({
				data: {
					stepNumber: data.stepNumber,
					recipeId: data.recipeId,
					text: data.text,
				},
			});

			return instruction;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error creating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(instructionId: string, data: TUpdateInstruction) {
		try {
			const instruction = await this.prisma.instruction.update({
				where: {
					id: instructionId,
				},
				data: {
					stepNumber: data.stepNumber,
					recipeId: data.recipeId,
					text: data.text,
				},
			});

			return instruction;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error updating resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(instructionId: string) {
		try {
			await this.prisma.instruction.delete({
				where: {
					id: instructionId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("Error deleting resource in DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
