import Elysia, { t } from "elysia";
import { authServices, favoriteService } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { generalDTO } from "../../application/dtos/generalDTO";

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

				set.status = 200;
				return new generalDTO(
					"success",
					"get favorites successfully",
					200,
					favorites,
				).dataResult();
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;

					return new generalDTO(
						"error",
						error.message,
						set.status,
						null,
					).dataResult();
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";

				return new generalDTO(
					"error",
					errorMessage,
					set.status,
					null,
				).dataResult();
			}
		},
		{
			detail: {
				tags: ["Favorites"],
				description: "Fetch all favorites for a given user ID.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
				"api-key": t.String(),
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
				return new generalDTO(
					"success",
					"add favorite successfully",
					200,
					newFavorite,
				).dataResult();
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;

					return new generalDTO(
						"error",
						error.message,
						set.status,
						null,
					).dataResult();
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";

				return new generalDTO(
					"error",
					errorMessage,
					set.status,
					null,
				).dataResult();
			}
		},
		{
			detail: {
				tags: ["Favorites"],
				description: "Create favorite.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
				"api-key": t.String(),
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
				set.status = 200;

				return new generalDTO("success", "delete favorites successfully", 200, {
					status: "success",
				}).dataResult();
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;

					return new generalDTO(
						"error",
						error.message,
						set.status,
						null,
					).dataResult();
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";

				return new generalDTO(
					"error",
					errorMessage,
					set.status,
					null,
				).dataResult();
			}
		},
		{
			detail: {
				tags: ["Favorites"],
				description: "Delete favorite.",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
				"api-key": t.String(),
			}),

			params: t.Object({
				favoriteId: t.String(),
			}),
		},
	);
