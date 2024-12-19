import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/authRouter";
import { categoryRouter } from "./presentation/router/categoryRouter";

const app = new Elysia()

	// Group /api
	.group("/api", (app) =>
		app
			//* Routes
			.use(authRouter)
			.use(categoryRouter),
	)

	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
