import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { authRouter } from "./presentation/router/authRouter";
import { categoryRouter } from "./presentation/router/categoryRouter";
import { ingredientRouter } from "./presentation/router/ingredientRouter";

const app = new Elysia()

	// swagger plugin handler
	.use(
		swagger({
			path: "/docs",
			// set config for setup swagger
			// more info on https://github.com/scalar/scalar/blob/main/documentation/configuration.md
			scalarConfig: {
				defaultHttpClient: {
					targetKey: "javascript",
					clientKey: "fetch",
				},
			},
		}),
	)

	// Group /api
	.group("/api", (app) =>
		app
			//* Routes
			.use(authRouter)
			.use(categoryRouter)
			.use(ingredientRouter),
	)

	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
