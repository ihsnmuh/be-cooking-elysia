import Elysia, { t } from "elysia";
import { authServices, categoryServices } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { ResponseDTO } from "../../application/dtos/responseDTO";

export const categoryRouter = new Elysia({ prefix: "/v1" })

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
				// * Create category
				.post(
					"/categories",
					async ({ body, set }) => {
						try {
							const newCategory = await categoryServices.create({
								name: body.name.toLocaleLowerCase(),
								imageUrl: body.imageUrl ?? "",
							});

							set.status = 201;
							return ResponseDTO.success(
								"create category successfully",
								201,
								newCategory,
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
							tags: ["Categories"],
							description: "Create a new category (Admin only).",
						},

						body: t.Object({
							name: t.String(),
							imageUrl: t.String(),
						}),
					},
				)

				// * Update category
				.patch(
					"/categories/:categoryId",
					async ({ body, params, set }) => {
						try {
							const updatedCategory = await categoryServices.update(
								params.categoryId,
								{
									name: body.name?.toLocaleLowerCase(),
									imageUrl: body.imageUrl ?? "",
								},
							);

							set.status = 200;
							return ResponseDTO.success(
								"Update category successfully",
								200,
								updatedCategory,
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
							tags: ["Categories"],
							description: "Update a category (Admin only).",
						},

						body: t.Object({
							name: t.Optional(t.String()),
							imageUrl: t.Optional(t.String()),
						}),
					},
				)

				// * Delete category
				.delete(
					"/categories/:categoryId",
					async ({ params, set }) => {
						try {
							await categoryServices.delete(params.categoryId);

							set.status = 200;
							return ResponseDTO.success(
								"Registered successfully",
								set.status,
								{
									message: "category is deleted",
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
							tags: ["Categories"],
							description: "Delete a category by ID (Admin only).",
						},
					},
				),
	)

	// * Get all categories
	.get(
		"/categories",
		async ({ set, query }) => {
			try {
				const allCategories = await categoryServices.getAll(query);

				set.status = 200;
				return ResponseDTO.success(
					"Registered successfully",
					200,
					allCategories,
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
				tags: ["Categories"],
				description: "Fetch all categories.",
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

	// * Get all categories by recipe id
	.get(
		"/categories/recipe",
		async ({ set, query }) => {
			try {
				const categories = await categoryServices.getAllByRecipeId(
					query.recipeId,
				);

				set.status = 200;
				return ResponseDTO.success(
					"get categories successfully",
					200,
					categories,
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
				tags: ["Categories"],
				description: "Fetch all categories for a given recipe ID.",
			},

			query: t.Object({
				recipeId: t.String(),
			}),
		},
	)

	// * Get one category
	.get(
		"/categories/:categoryIdOrName",
		async ({ params, set }) => {
			try {
				const category = await categoryServices.getOne(params.categoryIdOrName);

				return ResponseDTO.success(
					"get categories successfully",
					200,
					category,
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
				tags: ["Categories"],
				description: "Fetch one category by ID or name.",
			},
		},
	);
