-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "logoId" TEXT,
    "ownerId" TEXT NOT NULL,
    "settings" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workspace_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workspace" ("createdAt", "description", "id", "logoId", "name", "ownerId", "settings", "slug", "updatedAt") SELECT "createdAt", "description", "id", "logoId", "name", "ownerId", "settings", "slug", "updatedAt" FROM "workspace";
DROP TABLE "workspace";
ALTER TABLE "new_workspace" RENAME TO "workspace";
CREATE UNIQUE INDEX "workspace_slug_key" ON "workspace"("slug");
CREATE UNIQUE INDEX "workspace_logoId_key" ON "workspace"("logoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
