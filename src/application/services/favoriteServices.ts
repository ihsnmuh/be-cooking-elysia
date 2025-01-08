import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { FavoriteRepository } from "../../infrastructure/db/favoriteRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type { TCreateFavorite } from "../../infrastructure/entity/interface";
import { ValidationError } from "../../infrastructure/entity/error";

@injectable()
export class FavoriteService {
	private favoriteRepo: FavoriteRepository;

	constructor(@inject(TYPES.favoriteRepo) favoriteRepo: FavoriteRepository) {
		this.favoriteRepo = favoriteRepo;
	}

	async getAllByUserId(userId: string) {
		const favorites = await this.favoriteRepo.getAllByUserId(userId);
		return favorites;
	}

	async create(data: TCreateFavorite) {
		// check recipe on list favorite

		const listFavorite = await this.favoriteRepo.getAllByUserId(data.userId);

		const checkSameFavorite =
			listFavorite.filter((favorite) => favorite.recipeId === data.recipeId)
				.length > 0;

		if (checkSameFavorite) {
			throw new ValidationError("Recipe Already on Favorite List");
		}

		const newFavorite = await this.favoriteRepo.create(data);
		return newFavorite;
	}

	async delete(favoriteId: string, userId: string) {
		await this.favoriteRepo.delete(favoriteId, userId);
	}
}
