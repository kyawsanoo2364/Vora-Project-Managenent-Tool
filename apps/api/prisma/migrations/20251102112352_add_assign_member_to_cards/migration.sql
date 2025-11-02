-- CreateTable
CREATE TABLE "_cardsToBoardMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_cardsToBoardMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "boardMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_cardsToBoardMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_cardsToBoardMembers_AB_unique" ON "_cardsToBoardMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_cardsToBoardMembers_B_index" ON "_cardsToBoardMembers"("B");
