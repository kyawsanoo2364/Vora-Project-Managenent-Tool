-- CreateTable
CREATE TABLE "starredBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "starredBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "starredBoard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "starredBoard_boardId_key" ON "starredBoard"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "starredBoard_workspaceId_key" ON "starredBoard"("workspaceId");
