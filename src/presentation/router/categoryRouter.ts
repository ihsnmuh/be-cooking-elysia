import Elysia, { t } from "elysia";
import { authServices, categoryServices } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/error";

export const categoryRouter = new Elysia({ prefix: "/v1" })

	// * Get all categories
	.get("/categories", async ({ set }) => {
		try {
			const allCategories = await categoryServices.getAll();

			return allCategories;
		} catch (error) {
			set.status = 500;

			if (error instanceof Error) {
				throw new Error(error.message);
			}

			throw new Error("Something went wrong!");
		}
	})

	// * Get all categories by recipe id
	.get(
		"/categories/recipe",
		async ({ set, query }) => {
			try {
				const categories = await categoryServices.getAllByRecipeId(
					query.recipeId,
				);

				return categories;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			query: t.Object({
				recipeId: t.String(),
			}),
		},
	)

	// * Get one category
	.get("/categories/:categoryIdOrName", async ({ params, set }) => {
		try {
			const category = await categoryServices.getOne(params.categoryIdOrName);

			return category;
		} catch (error) {
			set.status = 500;

			if (error instanceof Error) {
				throw new Error(error.message);
			}

			throw new Error("Something went wrong!");
		}
	})

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
				return newCategory;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
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

				return updatedCategory;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			body: t.Object({
				name: t.Optional(t.String()),
				imageUrl: t.Optional(t.String()),
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

	// * Delete category
	.delete(
		"/categories/:categoryId",
		async ({ params, set }) => {
			try {
				await categoryServices.delete(params.categoryId);

				set.status = 204;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
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
