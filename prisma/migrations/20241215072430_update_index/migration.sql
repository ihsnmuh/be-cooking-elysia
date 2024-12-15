-- CreateIndex
CREATE INDEX "ReceiptCategory_receiptId_categoryId_idx" ON "ReceiptCategory"("receiptId", "categoryId");

-- CreateIndex
CREATE INDEX "ReceiptIngredient_receiptId_ingredientId_idx" ON "ReceiptIngredient"("receiptId", "ingredientId");
