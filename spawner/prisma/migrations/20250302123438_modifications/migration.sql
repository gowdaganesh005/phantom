-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Videos" (
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoLink" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT,
    "transcript" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Videos_videoId_key" ON "Videos"("videoId");

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
