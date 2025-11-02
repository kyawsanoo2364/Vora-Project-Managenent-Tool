/*
  Warnings:

  - You are about to drop the column `content` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `checklist` table. All the data in the column will be lost.
  - Added the required column `title` to the `checklist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "checklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "checklistId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "dueDate" DATETIME,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_checklistItem_to_boardMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_checklistItem_to_boardMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "boardMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_checklistItem_to_boardMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "checklistItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_checklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklist_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_checklist" ("cardId", "createdAt", "id", "orderIndex") SELECT "cardId", "createdAt", "id", "orderIndex" FROM "checklist";
DROP TABLE "checklist";
ALTER TABLE "new_checklist" RENAME TO "checklist";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_checklistItem_to_boardMembers_AB_unique" ON "_checklistItem_to_boardMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_checklistItem_to_boardMembers_B_index" ON "_checklistItem_to_boardMembers"("B");
