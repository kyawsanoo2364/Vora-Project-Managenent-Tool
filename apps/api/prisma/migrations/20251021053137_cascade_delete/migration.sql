-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_activity" ("action", "cardId", "createdAt", "id", "userId") SELECT "action", "cardId", "createdAt", "id", "userId" FROM "activity";
DROP TABLE "activity";
ALTER TABLE "new_activity" RENAME TO "activity";
CREATE TABLE "new_attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attachment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attachment" ("cardId", "createdAt", "id", "mediaId", "userId") SELECT "cardId", "createdAt", "id", "mediaId", "userId" FROM "attachment";
DROP TABLE "attachment";
ALTER TABLE "new_attachment" RENAME TO "attachment";
CREATE UNIQUE INDEX "attachment_mediaId_key" ON "attachment"("mediaId");
CREATE TABLE "new_board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "description" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_board" ("background", "createdAt", "description", "id", "name", "updatedAt", "workspaceId") SELECT "background", "createdAt", "description", "id", "name", "updatedAt", "workspaceId" FROM "board";
DROP TABLE "board";
ALTER TABLE "new_board" RENAME TO "board";
CREATE TABLE "new_boardMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "boardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "boardMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_boardMember" ("boardId", "createdAt", "id", "role", "userId") SELECT "boardId", "createdAt", "id", "role", "userId" FROM "boardMember";
DROP TABLE "boardMember";
ALTER TABLE "new_boardMember" RENAME TO "boardMember";
CREATE TABLE "new_card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT DEFAULT 'Medium',
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "listId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "card_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_card" ("createdAt", "description", "dueDate", "id", "isCompleted", "listId", "orderIndex", "priority", "startDate", "title", "updatedAt") SELECT "createdAt", "description", "dueDate", "id", "isCompleted", "listId", "orderIndex", "priority", "startDate", "title", "updatedAt" FROM "card";
DROP TABLE "card";
ALTER TABLE "new_card" RENAME TO "card";
CREATE TABLE "new_checklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "cardId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklist_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_checklist" ("cardId", "content", "createdAt", "id", "isCompleted", "orderIndex") SELECT "cardId", "content", "createdAt", "id", "isCompleted", "orderIndex" FROM "checklist";
DROP TABLE "checklist";
ALTER TABLE "new_checklist" RENAME TO "checklist";
CREATE TABLE "new_comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comment" ("cardId", "content", "createdAt", "id", "updatedAt", "userId") SELECT "cardId", "content", "createdAt", "id", "updatedAt", "userId" FROM "comment";
DROP TABLE "comment";
ALTER TABLE "new_comment" RENAME TO "comment";
CREATE TABLE "new_list" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "list_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_list" ("boardId", "id", "name", "orderIndex") SELECT "boardId", "id", "name", "orderIndex" FROM "list";
DROP TABLE "list";
ALTER TABLE "new_list" RENAME TO "list";
CREATE TABLE "new_starredBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "starredBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "starredBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "starredBoard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_starredBoard" ("boardId", "createdAt", "id", "userId", "workspaceId") SELECT "boardId", "createdAt", "id", "userId", "workspaceId" FROM "starredBoard";
DROP TABLE "starredBoard";
ALTER TABLE "new_starredBoard" RENAME TO "starredBoard";
CREATE TABLE "new_workspaceMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workspaceMember" ("createdAt", "id", "role", "userId", "workspaceId") SELECT "createdAt", "id", "role", "userId", "workspaceId" FROM "workspaceMember";
DROP TABLE "workspaceMember";
ALTER TABLE "new_workspaceMember" RENAME TO "workspaceMember";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
