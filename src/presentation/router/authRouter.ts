import Elysia, { t } from "elysia";
import { authServices } from "../../application/instance";
import { ResponseDTO } from "../../application/dtos/responseDTO";
import { ApplicationError } from "../../infrastructure/entity/error";

export const authRouter = new Elysia({ prefix: "/v1" })

	//* Register
	.post(
		"/register",
		async ({ body, set }) => {
			try {
				const newUser = await authServices.registerUser(
					body.name,
					body.email,
					body.username,
					body.role,
					body.password,
				);

				set.status = 201;
				return ResponseDTO.success(
					"Registered successfully",
					set.status,
					newUser,
				);
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
			}
		},
		{
			detail: {
				tags: ["Auth"],
				description: "Register a new user.",
			},
			// schema guard
			body: t.Object({
				name: t.String({ minLength: 3 }),
				email: t.String({ format: "email" }),
				username: t.String({ minLength: 4 }),
				role: t.Enum({ ADMIN: "ADMIN", USER: "USER" }),
				password: t.String({ minLength: 8 }),
			}),
		},
	)

	//* Login
	.post(
		"/login",
		async ({ body, set }) => {
			try {
				const session = await authServices.loginUser(
					body.emailOrUsername,
					body.password,
				);

				set.status = 200;
				return ResponseDTO.success("Login successfully", set.status, {
					sessionId: session.id,
				});
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
			}
		},
		{
			detail: {
				tags: ["Auth"],
				description: "Login user.",
			},

			body: t.Object({
				emailOrUsername: t.Union([
					t.String({ format: "email" }),
					t.String({ minLength: 4 }),
				]),
				password: t.String({ minLength: 8 }),
			}),
		},
	)

	//* Logout
	.post(
		"/logout",
		async ({ body, set }) => {
			try {
				const sessionId = body.sessionId;

				const isValid = await authServices.checkSession(sessionId);

				if (isValid !== "valid") {
					set.status = 401;
					return ResponseDTO.error("Logout is invalid", set.status);
				}

				await authServices.logoutUser(sessionId);
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
			}
		},
		{
			detail: {
				tags: ["Auth"],
				description: "Logout user.",
			},

			body: t.Object({
				sessionId: t.String(),
			}),
		},
	)

	//* Check session
	.post(
		"/session",
		async ({ body, set }) => {
			try {
				const sessionId = body.sessionId;

				const isValid = await authServices.checkSession(sessionId);

				if (isValid !== "valid") {
					set.status = 401;
					return ResponseDTO.error("Session is invalid", set.status);
				}

				set.status = 200;
				return ResponseDTO.success("Session is valid", set.status, {
					status: "valid",
				});
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
			}
		},
		{
			detail: {
				tags: ["Auth"],
				description: "Check session validity.",
			},

			body: t.Object({
				sessionId: t.String(),
			}),
		},
	);
