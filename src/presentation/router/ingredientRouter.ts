import Elysia, { t } from "elysia";
import { authServices, ingredientService } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/error";

export const ingredientRouter = new Elysia({ prefix: "/v1" })

	// * Get all ingredients
	.get(
		"/ingredients",
		async ({ set }) => {
			try {
				const allIngredients = await ingredientService.getAll();

				return allIngredients;
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
				tags: ["Ingredients"],
				description: "Fetch all ingredients.",
			},
		},
	)

	// * Get all ingredients by recipe id
	.get(
		"/ingredients/recipe",
		async ({ set, query }) => {
			try {
				const ingredients = await ingredientService.getAllByRecipeId(
					query.recipeId,
				);

				return ingredients;
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
				tags: ["Ingredients"],
				description: "Fetch all ingredients for a given recipe ID.",
			},

			query: t.Object({
				recipeId: t.String(),
			}),
		},
	)

	// * Get one ingredient
	.get(
		"/ingredients/:ingredientIdOrName",
		async ({ params, set }) => {
			try {
				const ingredient = await ingredientService.getOne(
					params.ingredientIdOrName,
				);

				return ingredient;
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
				tags: ["Ingredients"],
				description: "Fetch a single ingredient by its ID or name.",
			},
		},
	)

	// * Create new ingredient
	.post(
		"/ingredients",
		async ({ body, set }) => {
			try {
				const newIngredient = await ingredientService.create({
					name: body.name.toLocaleLowerCase(),
					imageUrl: body.imageUrl ?? "",
				});

				return newIngredient;
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
				tags: ["Ingredients"],
				description: "Create a new ingredient (Admin only).",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			body: t.Object({
				name: t.String(),
				imageUrl: t.String(),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	)

	// * Update ingredient
	.patch(
		"/ingredients/:ingredientId",
		async ({ params, body, set }) => {
			try {
				const updatedIngredient = await ingredientService.update(
					params.ingredientId,
					{
						name: body.name?.toLocaleLowerCase(),
						imageUrl: body.imageUrl ?? "",
					},
				);

				return updatedIngredient;
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
				tags: ["Ingredients"],
				description: "Update an ingredient by ID (Admin only).",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			body: t.Object({
				name: t.String(),
				imageUrl: t.String(),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	)

	// * Delete ingredient
	.delete(
		"/ingredients/:ingredientId",
		async ({ params, set }) => {
			try {
				await ingredientService.delete(params.ingredientId);

				return { message: "Ingredient deleted" };
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
				tags: ["Ingredients"],
				description: "Delete an ingredient by ID (Admin only).",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	);
