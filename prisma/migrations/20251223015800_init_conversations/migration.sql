-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('VOICE', 'TEXT');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('TWILIO', 'TELEGRAM', 'WEB', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('CUSTOMER', 'COMPANY');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "conversation" TEXT NOT NULL,
    "conversationType" "ConversationType" NOT NULL,
    "conversationVoiceUrl" TEXT,
    "direction" "Direction" NOT NULL,
    "channelUserId" TEXT,
    "displayName" TEXT,
    "displayPhotoUrl" TEXT,
    "channel" "Channel" NOT NULL,
    "externalId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_externalId_key" ON "Conversation"("externalId");

-- CreateIndex
CREATE INDEX "Conversation_channel_channelUserId_idx" ON "Conversation"("channel", "channelUserId");

-- CreateIndex
CREATE INDEX "Conversation_startedAt_idx" ON "Conversation"("startedAt");
