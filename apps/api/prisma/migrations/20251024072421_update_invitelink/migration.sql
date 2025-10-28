-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inviteLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inviteLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inviteLink" ("createdAt", "createdById", "expiresAt", "id", "maxUses", "revoked", "role", "scope", "scopeId", "tokenHash", "updatedAt", "usedCount") SELECT "createdAt", "createdById", "expiresAt", "id", "maxUses", "revoked", "role", "scope", "scopeId", "tokenHash", "updatedAt", "usedCount" FROM "inviteLink";
DROP TABLE "inviteLink";
ALTER TABLE "new_inviteLink" RENAME TO "inviteLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
