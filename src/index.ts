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

	.use(cors())

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
			.guard({
				headers: t.Object({
					authorization: t.Optional(t.TemplateLiteral("Bearer ${string}")),
				}),

				async beforeHandle({ set, request }) {
					console.log("🚀 ~ beforeHandle ~ request:", request.headers);

					const apiKey = request.headers.get("api-key");

					if (apiKey !== process.env.API_KEY) {
						set.status = 401;
						return new AuthorizationError("You are not allowed!");
					}
				},
			})

			//* Routes
			.use(authRouter)
			.use(categoryRouter)
			.use(ingredientRouter)
			.use(instructionRouter)
			.use(recipeRouter)
			.use(favoriteRouter)
			.use(uploadRouter),
	)

	// Serve the "public" directory as static files
	.use(staticPlugin())

	.listen(3001);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
