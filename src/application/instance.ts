import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/type";
import { UserRepository } from "../infrastructure/db/userRepo";
import { SessionRepository } from "../infrastructure/db/sessionRepo";
import { CategoryRepository } from "../infrastructure/db/categoryRepo";
import { IngredientRepository } from "../infrastructure/db/ingredientRepo";
import { InstructionRepository } from "../infrastructure/db/instructionRepo";
import { PrismaClient } from "@prisma/client";
import { AuthServices } from "./services/authServices";
import { CategoryServices } from "./services/categoryServices";
import { IngredientService } from "./services/ingredientService";
import { InstructionService } from "./services/instructionService";

const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);
container.bind(TYPES.categoryRepo).to(CategoryRepository);
container.bind(TYPES.ingredientRepo).to(IngredientRepository);
container.bind(TYPES.InstructionRepo).to(InstructionRepository);

container.bind(AuthServices).toSelf();
container.bind(CategoryServices).toSelf();
container.bind(IngredientService).toSelf();
container.bind(InstructionService).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const categoryServices =
	container.get<CategoryServices>(CategoryServices);
export const ingredientService =
	container.get<IngredientService>(IngredientService);
export const instructionService =
	container.get<InstructionService>(InstructionService);
