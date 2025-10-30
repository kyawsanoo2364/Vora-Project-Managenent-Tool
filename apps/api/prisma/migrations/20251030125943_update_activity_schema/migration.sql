-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "cardId" TEXT,
    "listId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_activity" ("action", "cardId", "createdAt", "id", "userId") SELECT "action", "cardId", "createdAt", "id", "userId" FROM "activity";
DROP TABLE "activity";
ALTER TABLE "new_activity" RENAME TO "activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
