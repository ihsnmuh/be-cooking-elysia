import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/type";
import { UserRepository } from "../infrastructure/db/userRepo";
import { SessionRepository } from "../infrastructure/db/sessionRepo";
import { PrismaClient } from "@prisma/client";
import { AuthServices } from "./services/authServices";

const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);

container.bind(AuthServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
