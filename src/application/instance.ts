import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/type";
import { UserRepository } from "../infrastructure/db/userRepo";
import { SessionRepository } from "../infrastructure/db/sessionRepo";
import { CategoryRepository } from "../infrastructure/db/categoryRepo";
import { PrismaClient } from "@prisma/client";
import { AuthServices } from "./services/authServices";
import { CategoryServices } from "./services/categoryServices";
import { IngredientRepository } from "../infrastructure/db/ingredientRepo";

const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);
container.bind(TYPES.categoryRepo).to(CategoryRepository);
container.bind(TYPES.ingredientRepo).to(IngredientRepository);

container.bind(AuthServices).toSelf();
container.bind(CategoryServices).toSelf();
container.bind(IngredientRepository).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const categoryServices =
	container.get<CategoryServices>(CategoryServices);
export const ingredientRepository =
	container.get<IngredientRepository>(IngredientRepository);
