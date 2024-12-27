import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { authRouter } from "./presentation/router/authRouter";
import { categoryRouter } from "./presentation/router/categoryRouter";
import { ingredientRouter } from "./presentation/router/ingredientRouter";
import { instructionRouter } from "./presentation/router/instructionRouter";
import { recipeRouter } from "./presentation/router/recipeRouter";

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
			.use(ingredientRouter)
			.use(instructionRouter)
			.use(recipeRouter),
	)

	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
