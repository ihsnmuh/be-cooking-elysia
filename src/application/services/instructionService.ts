import { inject, injectable } from "inversify";
import type { InstructionRepository } from "../../infrastructure/db/instructionRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type {
	TCreateInstruction,
	TUpdateInstruction,
} from "../../infrastructure/entity/interface";

@injectable()
export class InstructionService {
	private instructionRepo: InstructionRepository;

	constructor(
		@inject(TYPES.InstructionRepo) instructionRepo: InstructionRepository,
	) {
		this.instructionRepo = instructionRepo;
	}

	async getAll() {
		const allInstructions = await this.instructionRepo.getAll();
		return allInstructions;
	}

	async getAllByRecipeId(recipeId: string) {
		const instructions = await this.instructionRepo.getAllByRecipeId(recipeId);
		return instructions;
	}

	async getOne(instructionId: string) {
		const instruction = await this.instructionRepo.getOne(instructionId);
		return instruction;
	}

	async create(data: TCreateInstruction) {
		const newInstruction = await this.instructionRepo.create(data);
		return newInstruction;
	}

	async update(instructionId: string, data: TUpdateInstruction) {
		const updatedInstruction = await this.instructionRepo.update(
			instructionId,
			data,
		);
		return updatedInstruction;
	}

	async delete(instructionId: string) {
		await this.instructionRepo.delete(instructionId);
	}
}
