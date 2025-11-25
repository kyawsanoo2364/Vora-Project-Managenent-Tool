-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT DEFAULT 'Medium',
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "listId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "coverId" TEXT,
    "userId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "card_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "card_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "attachment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_card" ("createdAt", "description", "dueDate", "id", "isCompleted", "listId", "orderIndex", "priority", "startDate", "title", "updatedAt", "userId") SELECT "createdAt", "description", "dueDate", "id", "isCompleted", "listId", "orderIndex", "priority", "startDate", "title", "updatedAt", "userId" FROM "card";
DROP TABLE "card";
ALTER TABLE "new_card" RENAME TO "card";
CREATE UNIQUE INDEX "card_coverId_key" ON "card"("coverId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
