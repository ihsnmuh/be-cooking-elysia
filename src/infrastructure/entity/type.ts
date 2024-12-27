export const TYPES = {
	userRepo: Symbol.for("UserRepository"),
	recipeRepo: Symbol.for("RecipeRepository"),
	categoryRepo: Symbol.for("CategoryRepository"),
	sessionRepo: Symbol.for("SessionRepository"),
	ingredientRepo: Symbol.for("IngredientRepository"),
	instructionRepo: Symbol.for("InstructionRepository"),
	favoriteRepo: Symbol.for("FavoriteRepository"),
	prisma: Symbol.for("PrismaClient"),
	logger: Symbol.for("Logger"),
};
