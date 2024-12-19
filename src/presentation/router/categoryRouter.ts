import Elysia, { t } from "elysia";
import { categoryServices } from "../../application/instance";

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

	// * Get all categories by receipt id
	.get(
		"/categories",
		async ({ set, query }) => {
			try {
				const categories = await categoryServices.getAllByReceiptId(
					query.receiptId,
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
				receiptId: t.String(),
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
		"/category",
		async ({ body, set }) => {
			try {
				const newCategory = await categoryServices.create({
					name: body.name,
					imageUrl: body.imageUrl,
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
			body: t.Object({
				name: t.String(),
				imageUrl: t.String({ format: "uri" }),
			}),
		},
	)

	// * Update category
	.patch(
		"/category/:categoryId",
		async ({ body, params, set }) => {
			try {
				const updatedCategory = await categoryServices.update(
					params.categoryId,
					{
						name: body.name,
						imageUrl: body.imageUrl,
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
			body: t.Object({
				name: t.Optional(t.String()),
				imageUrl: t.Optional(t.String({ format: "uri" })),
			}),
		},
	)

	// * Delete category
	.delete("/category/:categoryId", async ({ params, set }) => {
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
	});
