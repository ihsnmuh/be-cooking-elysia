import Elysia, { t } from "elysia";
import { authServices, ingredientService } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { ResponseDTO } from "../../application/dtos/responseDTO";

export const ingredientRouter = new Elysia({ prefix: "/v1" })

	.guard(
		{
			headers: t.Object({
				authorization: t.TemplateLiteral("Bearer ${string}"),
				"api-key": t.String(),
			}),

			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];
				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);
				if (user.role !== "ADMIN")
					throw new AuthorizationError("You are not allow");
			},
		},
		(app) =>
			app

				// * Create new ingredient
				.post(
					"/ingredients",
					async ({ body, set }) => {
						try {
							const newIngredient = await ingredientService.create({
								name: body.name.toLocaleLowerCase(),
								imageUrl: body.imageUrl ?? "",
							});

							set.status = 201;
							return ResponseDTO.success(
								"create ingredient successfully",
								201,
								newIngredient,
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Ingredients"],
							description: "Create a new ingredient (Admin only).",
						},

						body: t.Object({
							name: t.String(),
							imageUrl: t.String(),
						}),
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

							set.status = 200;
							return ResponseDTO.success(
								"update ingredient successfully",
								set.status,
								updatedIngredient,
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Ingredients"],
							description: "Update an ingredient by ID (Admin only).",
						},

						body: t.Object({
							name: t.String(),
							imageUrl: t.String(),
						}),
					},
				)

				// * Delete ingredient
				.delete(
					"/ingredients/:ingredientId",
					async ({ params, set }) => {
						try {
							await ingredientService.delete(params.ingredientId);

							set.status = 200;
							return ResponseDTO.success(
								"delete ingredient successfully",
								200,
								{
									message: "Ingredient deleted",
								},
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Ingredients"],
							description: "Delete an ingredient by ID (Admin only).",
						},
					},
				),
	)

	// * Get all ingredients
	.get(
		"/ingredients",
		async ({ set }) => {
			try {
				const allIngredients = await ingredientService.getAll();

				set.status = 200;
				return ResponseDTO.success(
					"get ingredients successfully",
					200,
					allIngredients,
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

				set.status = 200;
				return ResponseDTO.success(
					"get ingredients by recipe id successfully",
					200,
					ingredients,
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

				set.status = 200;
				return ResponseDTO.success(
					"get ingredient successfully",
					set.status,
					ingredient,
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
				tags: ["Ingredients"],
				description: "Fetch a single ingredient by its ID or name.",
			},
		},
	);
