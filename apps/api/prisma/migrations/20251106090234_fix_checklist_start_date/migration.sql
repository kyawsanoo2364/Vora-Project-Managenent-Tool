-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_checklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "checklistId" TEXT NOT NULL,
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_checklistItem" ("checklistId", "content", "createdAt", "dueDate", "id", "isCompleted", "orderIndex", "startDate") SELECT "checklistId", "content", "createdAt", "dueDate", "id", "isCompleted", "orderIndex", "startDate" FROM "checklistItem";
DROP TABLE "checklistItem";
ALTER TABLE "new_checklistItem" RENAME TO "checklistItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
