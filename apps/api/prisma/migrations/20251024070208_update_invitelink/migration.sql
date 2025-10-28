/*
  Warnings:

  - A unique constraint covering the columns `[scopeId,createdById]` on the table `inviteLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inviteLink_scopeId_createdById_key" ON "inviteLink"("scopeId", "createdById");
