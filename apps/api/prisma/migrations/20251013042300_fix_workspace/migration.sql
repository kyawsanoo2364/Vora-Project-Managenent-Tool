/*
  Warnings:

  - Added the required column `ownerId` to the `workspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `workspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `workspace` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "ownerId" TEXT NOT NULL,
    "settings" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workspace" ("id", "name") SELECT "id", "name" FROM "workspace";
DROP TABLE "workspace";
ALTER TABLE "new_workspace" RENAME TO "workspace";
CREATE UNIQUE INDEX "workspace_slug_key" ON "workspace"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
