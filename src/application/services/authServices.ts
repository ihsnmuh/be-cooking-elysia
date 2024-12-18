import { inject, injectable } from "inversify";
import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";
import {
	AuthorizationError,
	NotFoundError,
} from "../../infrastructure/entity/error";
import { TYPES } from "../../infrastructure/entity/type";
import { userDTO } from "../dtos/userDTO";

@injectable()
export class AuthServices {
	private userRepo: UserRepository;
	private sessionRepo: SessionRepository;

	constructor(
		@inject(TYPES.userRepo) userRepo: UserRepository,
		@inject(TYPES.sessionRepo) sessionRepo: SessionRepository,
	) {
		this.userRepo = userRepo;
		this.sessionRepo = sessionRepo;
	}

	async registerUser(
		name: string,
		email: string,
		username: string,
		password: string,
	) {
		// check collision => email/user available
		const user = await this.userRepo.getOne(email);

		if (user) {
			// User Available
			throw new Error("User Already Register");
		}

		// hash password user
		const hashedPassword = await Bun.password.hash(password);
		// Create New User
		const newUser = await this.userRepo.create({
			name,
			email,
			username,
			password: hashedPassword,
			avatar: "",
		});

		return new userDTO(newUser).fromEntity();
	}

	async loginUser(emailOrUsername: string, password: string) {
		const user = await this.userRepo.getOne(emailOrUsername);

		if (!user) {
			throw new NotFoundError("User not Found");
		}

		// mathing password
		const matchPassword = await Bun.password.verify(password, user.password);
		if (!matchPassword) {
			throw new AuthorizationError("Invalid Credential");
		}

		// Create Session
		const createSession = await this.sessionRepo.create(user.id);

		return createSession;
	}

	async logoutUser(sessionId: string) {
		const deleteSession = await this.sessionRepo.delete(sessionId);

		return deleteSession;
	}

	async checkSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		if (!session) {
			throw new AuthorizationError("Session Invalid");
		}

		return "valid";
	}

	async decodeSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		if (!session) {
			throw new Error("Session Invalid");
		}

		const user = await this.userRepo.getOne(session.userId);

		if (!user) {
			throw new Error("Session Invalid");
		}

		return { user };
	}
}
