import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { AuthorizationError } from "./infrastructure/entity/error";
import { authRouter } from "./presentation/router/authRouter";
import { categoryRouter } from "./presentation/router/categoryRouter";
import { favoriteRouter } from "./presentation/router/favoriteRouter";
import { ingredientRouter } from "./presentation/router/ingredientRouter";
import { instructionRouter } from "./presentation/router/instructionRouter";
import { recipeRouter } from "./presentation/router/recipeRouter";
import { uploadRouter } from "./presentation/router/uploadRouter";

const app = new Elysia()

	.get("/test", () => {
		return "ok";
	})

	.use(
		cors({
			origin: "*", // Or specify your allowed origins
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "api-key"],
			exposeHeaders: ["Content-Type", "Authorization", "api-key"],
			credentials: true,
			maxAge: 3600,
		}),
	)

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
			// * Guard
			.guard(
				{
					headers: t.Object({
						"api-key": t.String(),
					}),
					beforeHandle({ set, headers }) {
						const apiKey = headers["api-key"];

						if (!apiKey) {
							console.log("API Key is missing");
							set.status = 401;
							return new AuthorizationError("API Key is required!");
						}

						if (apiKey !== process.env.API_KEY) {
							console.log("Invalid API Key");
							set.status = 401;
							return new AuthorizationError("You are not allowed!");
						}
					},
				},
				(app) =>
					app
						//* Routes
						.use(authRouter)
						.use(categoryRouter)
						.use(ingredientRouter)
						.use(instructionRouter)
						.use(recipeRouter)
						.use(favoriteRouter)
						.use(uploadRouter),
			),
	)

	// Serve the "public" directory as static files
	.use(staticPlugin())

	.listen(3001);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
