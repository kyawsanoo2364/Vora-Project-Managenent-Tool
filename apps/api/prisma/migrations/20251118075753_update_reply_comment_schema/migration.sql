/*
  Warnings:

  - Added the required column `userId` to the `replyComment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_replyComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "replyToId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "replyComment_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "replyComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_replyComment" ("content", "createdAt", "id", "replyToId", "updatedAt") SELECT "content", "createdAt", "id", "replyToId", "updatedAt" FROM "replyComment";
DROP TABLE "replyComment";
ALTER TABLE "new_replyComment" RENAME TO "replyComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
