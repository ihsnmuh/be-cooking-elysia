import Elysia, { t } from "elysia";
import { authServices, recipeServices } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/error";

export const recipeRouter = new Elysia({ prefix: "/v1" })

	//* grouping route only need auth
	.guard((app) =>
		app
			// * Get session Id to see if user is logged in
			.derive(async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];
				if (!sessionId) throw new AuthorizationError("SessionId not provided!");

				const { user } = await authServices.decodeSession(sessionId);
				if (!user) throw new AuthorizationError("User not found in session!");
				return { user };
			})

			// * Create Recipe
			.post(
				"/recipes",
				async ({ set, body, user }) => {
					if (!user) {
						throw new AuthorizationError(
							"User is undefined! Authentication failed.",
						);
					}

					try {
						const recipe = await recipeServices.create({
							title: body.title,
							description: body.description,
							userId: user.id,
							imageUrl: body.imageUrl,
							servings: body.servings,
							cookingTime: body.cookingTime,
							categories: body.categories,
							ingredients: body.ingredients,
							instructions: body.instructions,
						});

						return recipe;
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
						tags: ["Recipes"],
						description: "Create a new recipe.",
					},

					headers: t.Object({
						authorization: t.String(),
					}),

					body: t.Object({
						title: t.String(),
						description: t.String(),
						userId: t.String(),
						imageUrl: t.String(),
						servings: t.Number(),
						cookingTime: t.Number(),
						categories: t.Array(t.Object({ id: t.String() })),
						ingredients: t.Array(
							t.Object({
								quantity: t.Number(),
								unit: t.String(),
								ingredientId: t.String(),
							}),
						),
						instructions: t.Array(
							t.Object({
								text: t.String(),
								stepNumber: t.Number(),
							}),
						),
					}),
				},
			)

			// * Update Recipe
			.patch(
				"/recipes/:recipeId",
				async ({ set, body, params, user }) => {
					if (!user) {
						throw new AuthorizationError(
							"User is undefined! Authentication failed.",
						);
					}

					try {
						const recipe = await recipeServices.update(params.recipeId, {
							title: body.title,
							description: body.description,
							imageUrl: body.imageUrl,
							userId: user.id,
							servings: body.servings,
							cookingTime: body.cookingTime,
							categories: body.categories,
							ingredients: body.ingredients,
							instructions: body.instructions,
						});

						return recipe;
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
						tags: ["Recipes"],
						description: "Update a recipe.",
					},

					params: t.Object({
						recipeId: t.String(),
					}),

					body: t.Object({
						title: t.String(),
						description: t.String(),
						imageUrl: t.String(),
						servings: t.Number(),
						userId: t.String(),
						cookingTime: t.Number(),
						categories: t.Array(
							t.Object({ id: t.String(), categoryId: t.String() }),
						),
						ingredients: t.Array(
							t.Object({
								id: t.String(),
								quantity: t.Number(),
								unit: t.String(),
								ingredientId: t.String(),
							}),
						),
						instructions: t.Array(
							t.Object({
								id: t.String(),
								text: t.String(),
								stepNumber: t.Number(),
							}),
						),
					}),
				},
			)

			// * Delete Recipe
			.delete(
				"/recipes/:recipeId",
				async ({ set, params, user }) => {
					if (!user) {
						throw new AuthorizationError(
							"User is undefined! Authentication failed.",
						);
					}

					try {
						await recipeServices.delete(params.recipeId, user.id);

						return { status: "success" };
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
						tags: ["Recipes"],
						description: "Delete a recipe.",
					},

					params: t.Object({
						recipeId: t.String(),
					}),
				},
			),
	)

	// * Get all recipes
	.get(
		"/recipes",
		async ({ set }) => {
			try {
				const allRecipes = await recipeServices.getAll();

				return allRecipes;
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
				tags: ["Recipes"],
				description: "Fetch all recipes.",
			},
		},
	)

	// * Get recipes by UserId
	.get(
		"/recipes/user",
		async ({ set, query }) => {
			try {
				const recipes = await recipeServices.getAllByUserId(query.userId);

				return recipes;
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given user ID.",
			},

			query: t.Object({
				userId: t.String(),
			}),
		},
	)

	// * Get recipes by CategoryId
	.get(
		"/recipes/category",
		async ({ set, query }) => {
			try {
				const recipes = await recipeServices.getAllByCategoryId(
					query.categoryId,
				);

				return recipes;
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given category ID.",
			},

			query: t.Object({
				categoryId: t.String(),
			}),
		},
	)

	// * Get recipes by IngredientId
	.get(
		"/recipes/ingredient",
		async ({ set, query }) => {
			try {
				const recipes = await recipeServices.getAllByIngredientId(
					query.ingredientId,
				);

				return recipes;
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given ingredient ID.",
			},

			query: t.Object({
				ingredientId: t.String(),
			}),
		},
	)

	// * Get one recipe
	.get(
		"/recipes/:recipeId",
		async ({ set, params }) => {
			try {
				const recipe = await recipeServices.getOne(params.recipeId);

				return recipe;
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
				tags: ["Recipes"],
				description: "Fetch one recipe by recipe ID.",
			},

			params: t.Object({
				recipeId: t.String(),
			}),
		},
	);
