import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/authRouter";

const app = new Elysia()

	// Group /api
	.group("/api", (app) =>
		app
			//* Routes
			.use(authRouter),
	)

	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
