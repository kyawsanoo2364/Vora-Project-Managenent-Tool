/*
  Warnings:

  - You are about to drop the column `filename` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `workspace` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attachment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_attachment" ("cardId", "createdAt", "id", "userId") SELECT "cardId", "createdAt", "id", "userId" FROM "attachment";
DROP TABLE "attachment";
ALTER TABLE "new_attachment" RENAME TO "attachment";
CREATE UNIQUE INDEX "attachment_mediaId_key" ON "attachment"("mediaId");
CREATE TABLE "new_workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "logoId" TEXT,
    "ownerId" TEXT NOT NULL,
    "settings" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workspace_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workspace" ("createdAt", "description", "id", "name", "ownerId", "settings", "slug", "updatedAt") SELECT "createdAt", "description", "id", "name", "ownerId", "settings", "slug", "updatedAt" FROM "workspace";
DROP TABLE "workspace";
ALTER TABLE "new_workspace" RENAME TO "workspace";
CREATE UNIQUE INDEX "workspace_slug_key" ON "workspace"("slug");
CREATE UNIQUE INDEX "workspace_logoId_key" ON "workspace"("logoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
