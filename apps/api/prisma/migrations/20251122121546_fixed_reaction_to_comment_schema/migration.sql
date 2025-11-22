-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reactionToComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emoji" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactionToComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reactionToComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reactionToComment" ("commentId", "createdAt", "emoji", "id", "userId") SELECT "commentId", "createdAt", "emoji", "id", "userId" FROM "reactionToComment";
DROP TABLE "reactionToComment";
ALTER TABLE "new_reactionToComment" RENAME TO "reactionToComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
