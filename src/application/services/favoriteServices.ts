import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { FavoriteRepository } from "../../infrastructure/db/favoriteRepo";
import { TYPES } from "../../infrastructure/entity/type";
import type { TCreateFavorite } from "../../infrastructure/entity/interface";

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
		const newFavorite = await this.favoriteRepo.create(data);
		return newFavorite;
	}

	async delete(favoriteId: string, userId: string) {
		await this.favoriteRepo.delete(favoriteId, userId);
	}
}
