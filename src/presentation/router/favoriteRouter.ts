import Elysia, { t } from "elysia";
import { authServices, favoriteService } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/error";

export const favoriteRouter = new Elysia({ prefix: "/v1" })

	.derive(async ({ headers }) => {
		const sessionId = headers.authorization?.split(" ")[1];
		if (!sessionId) throw new AuthorizationError("SessionId not provided!");

		const { user } = await authServices.decodeSession(sessionId);
		if (!user) throw new AuthorizationError("User not found in session!");
		return { user };
	})

	// * Get all favorite by userId
	.get(
		"/favorites",
		async ({ set, user }) => {
			try {
				const favorites = await favoriteService.getAllByUserId(user.id);
				return favorites;
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
				tags: ["Favorites"],
				description: "Fetch all favorites for a given user ID.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),
		},
	)

	// * Create favorite
	.post(
		"/favorites",
		async ({ body, set, user }) => {
			try {
				const newFavorite = await favoriteService.create({
					userId: user.id,
					recipeId: body.recipeId,
				});

				set.status = 201;
				return newFavorite;
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
				tags: ["Favorites"],
				description: "Create favorite.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			body: t.Object({
				recipeId: t.String(),
			}),
		},
	)

	// * Delete Favorite
	.delete(
		"/favorites/:favoriteId",
		async ({ set, params, user }) => {
			try {
				await favoriteService.delete(params.favoriteId, user.id);
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
				tags: ["Favorites"],
				description: "Delete favorite.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			params: t.Object({
				favoriteId: t.String(),
			}),
		},
	);
