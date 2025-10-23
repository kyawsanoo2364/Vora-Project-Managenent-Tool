/*
  Warnings:

  - Added the required column `userId` to the `starredBoard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_starredBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "starredBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "starredBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "starredBoard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_starredBoard" ("boardId", "createdAt", "id", "workspaceId") SELECT "boardId", "createdAt", "id", "workspaceId" FROM "starredBoard";
DROP TABLE "starredBoard";
ALTER TABLE "new_starredBoard" RENAME TO "starredBoard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
