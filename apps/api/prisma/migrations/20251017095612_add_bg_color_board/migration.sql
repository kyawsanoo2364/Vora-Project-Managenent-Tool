/*
  Warnings:

  - Added the required column `background` to the `board` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    CONSTRAINT "board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_board" ("id", "name", "workspaceId") SELECT "id", "name", "workspaceId" FROM "board";
DROP TABLE "board";
ALTER TABLE "new_board" RENAME TO "board";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
