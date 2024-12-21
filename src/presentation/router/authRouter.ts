import Elysia, { t } from "elysia";
import { authServices } from "../../application/instance";

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
				return newUser;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
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
				return { sessionId: session.id };
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
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
			console.log("🚀 ~ body:", body);
			try {
				const sessionId = body.sessionId;

				const isValid = await authServices.checkSession(sessionId);

				if (isValid !== "valid") {
					set.status = 401;
					return { status: "invalid" };
				}

				await authServices.logoutUser(sessionId);
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
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
					return { status: "invalid" };
				}

				return { status: "valid" };
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
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
