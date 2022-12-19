-- CreateTable
CREATE TABLE "Channel" (
    "channelId" BIGINT NOT NULL PRIMARY KEY,
    "roleId" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" BIGINT NOT NULL,
    CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Channel" ("channelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelId_key" ON "Channel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_roleId_key" ON "Channel"("roleId");
