import Elysia, { t } from "elysia";
import { authServices, recipeServices } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { ResponseDTO } from "../../application/dtos/responseDTO";

export const recipeRouter = new Elysia({ prefix: "/v1" })

	//* grouping route only need auth
	.guard((app) =>
		app
			// * Get session Id to see if user is logged in
			.derive(async ({ headers }) => {
				console.log("🚀 ~ .derive ~ headers:", headers);
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

						set.status = 201;
						return ResponseDTO.success(
							"create recipe successfully",
							201,
							recipe,
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
						tags: ["Recipes"],
						description: "Create a new recipe.",
					},

					headers: t.Object({
						authorization: t.String(),
						"api-key": t.String(),
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

						set.status = 200;
						return ResponseDTO.success(
							"update recipe successfully",
							200,
							recipe,
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
						tags: ["Recipes"],
						description: "Update a recipe.",
					},

					params: t.Object({
						recipeId: t.String(),
					}),

					headers: t.Object({
						authorization: t.String(),
						"api-key": t.String(),
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

						set.status = 200;
						return ResponseDTO.success("delete recipe successfully", 200, {
							status: "success",
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
						tags: ["Recipes"],
						description: "Delete a recipe.",
					},

					headers: t.Object({
						authorization: t.String(),
						"api-key": t.String(),
					}),

					params: t.Object({
						recipeId: t.String(),
					}),
				},
			),
	)

	// * Get all recipes
	.get(
		"/recipes",
		async ({ set, query }) => {
			try {
				const allRecipes = await recipeServices.getAll(query);

				set.status = 200;
				return ResponseDTO.success(
					"get all recipes successfully",
					200,
					allRecipes,
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
				tags: ["Recipes"],
				description: "Fetch all recipes.",
			},

			query: t.Optional(
				t.Object({
					page: t.Optional(t.Number()),
					limit: t.Optional(t.Number()),
					sort: t.Optional(
						t.Union([
							t.Literal("newest"),
							t.Literal("latest"),
							t.Literal("a-z"),
							t.Literal("newest"),
						]),
					),
					search: t.Optional(t.String()),
				}),
			),
		},
	)

	// * Get recipes by UserId
	.get(
		"/recipes/user",
		async ({ set, query }) => {
			try {
				const recipes = await recipeServices.getAllByUserId(
					query.userId,
					query,
				);

				set.status = 200;
				return ResponseDTO.success(
					"get all recipes by userId successfully",
					200,
					recipes,
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given user ID.",
			},

			query: t.Object({
				userId: t.String(),
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
				sort: t.Optional(
					t.Union([
						t.Literal("newest"),
						t.Literal("latest"),
						t.Literal("a-z"),
						t.Literal("newest"),
					]),
				),
				search: t.Optional(t.String()),
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
					query,
				);

				set.status = 200;
				return ResponseDTO.success(
					"get all recipes by category successfully",
					200,
					recipes,
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given category ID.",
			},

			query: t.Object({
				categoryId: t.String(),
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
				sort: t.Optional(
					t.Union([
						t.Literal("newest"),
						t.Literal("latest"),
						t.Literal("a-z"),
						t.Literal("newest"),
					]),
				),
				search: t.Optional(t.String()),
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
					query,
				);

				set.status = 200;
				return ResponseDTO.success(
					"get all recipes by category successfully",
					200,
					recipes,
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
				tags: ["Recipes"],
				description: "Fetch all recipes for a given ingredient ID.",
			},

			query: t.Object({
				ingredientId: t.String(),
				page: t.Optional(t.Number()),
				limit: t.Optional(t.Number()),
				sort: t.Optional(
					t.Union([
						t.Literal("newest"),
						t.Literal("latest"),
						t.Literal("a-z"),
						t.Literal("newest"),
					]),
				),
				search: t.Optional(t.String()),
			}),
		},
	)

	// * Get one recipe
	.get(
		"/recipes/:recipeId",
		async ({ set, params }) => {
			try {
				const recipe = await recipeServices.getOne(params.recipeId);

				set.status = 200;
				return ResponseDTO.success("get recipe successfully", 200, recipe);
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
				tags: ["Recipes"],
				description: "Fetch one recipe by recipe ID.",
			},

			params: t.Object({
				recipeId: t.String(),
			}),
		},
	);
