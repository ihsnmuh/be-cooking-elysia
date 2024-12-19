import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/type";
import { UserRepository } from "../infrastructure/db/userRepo";
import { SessionRepository } from "../infrastructure/db/sessionRepo";
import { CategoryRepository } from "../infrastructure/db/categoryRepo";
import { PrismaClient } from "@prisma/client";
import { AuthServices } from "./services/authServices";
import { CategoryServices } from "./services/categoryServices";

const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);
container.bind(TYPES.categoryRepo).to(CategoryRepository);

container.bind(AuthServices).toSelf();
container.bind(CategoryServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const categoryServices =
	container.get<CategoryServices>(CategoryServices);
