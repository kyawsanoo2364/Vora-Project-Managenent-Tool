-- CreateTable
CREATE TABLE "reactionToComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emoji" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactionToComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reactionToComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
