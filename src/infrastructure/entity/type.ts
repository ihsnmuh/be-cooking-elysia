export const TYPES = {
	userRepo: Symbol.for("UserRepository"),
	categoryRepo: Symbol.for("CategoryRepository"),
	sessionRepo: Symbol.for("SessionRepository"),
	ingredientRepo: Symbol.for("IngredientRepository"),
	InstructionRepo: Symbol.for("InstructionRepository"),
	prisma: Symbol.for("PrismaClient"),
	logger: Symbol.for("Logger"),
};
