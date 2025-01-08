import Elysia, { t } from "elysia";
import { authServices, favoriteService } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { ResponseDTO } from "../../application/dtos/responseDTO";

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
				return ResponseDTO.success("get favorites sucessfully", 200, favorites);
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
				return ResponseDTO.success(
					"add favorite successfully",
					201,
					newFavorite,
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

				return ResponseDTO.success("delete favorite successfully", 200, {
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
