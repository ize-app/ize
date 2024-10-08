/*
  Warnings:

  - The values [GroupUpdateMetadata,GroupUpdateMembership,GroupUpdateNotifications] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [GroupUpdateMetadata,GroupUpdateMembership,GroupUpdateNotifications] on the enum `FlowType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notification_webhook_id` on the `groups_custom` table. All the data in the column will be lost.
  - You are about to drop the column `actions_complete` on the `request_steps` table. All the data in the column will be lost.
  - You are about to drop the column `response_complete` on the `request_steps` table. All the data in the column will be lost.
  - You are about to drop the column `results_complete` on the `request_steps` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `complete` on the `results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[request_step_id,result_config_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('CallWebhook', 'TriggerStep', 'EvolveFlow', 'EvolveGroup', 'GroupWatchFlow');
ALTER TABLE "actions" ALTER COLUMN "type" TYPE "ActionType_new" USING ("type"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FlowType_new" AS ENUM ('Custom', 'Evolve', 'EvolveGroup', 'GroupWatchFlow');
ALTER TABLE "flows" ALTER COLUMN "type" TYPE "FlowType_new" USING ("type"::text::"FlowType_new");
ALTER TYPE "FlowType" RENAME TO "FlowType_old";
ALTER TYPE "FlowType_new" RENAME TO "FlowType";
DROP TYPE "FlowType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "GroupType" ADD VALUE 'GroupTelegram';

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "groups_custom" DROP CONSTRAINT "groups_custom_notification_webhook_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_creator_id_fkey";

-- AlterTable
ALTER TABLE "action_executions" ADD COLUMN     "final" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "next_retry_at" TIMESTAMP(3),
ADD COLUMN     "retry_attempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "creator_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "groups_custom" DROP COLUMN "notification_webhook_id",
ADD COLUMN     "notification_entity_id" UUID;

-- AlterTable
ALTER TABLE "request_steps" DROP COLUMN "actions_complete",
DROP COLUMN "response_complete",
DROP COLUMN "results_complete",
ADD COLUMN     "actions_final" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "response_final" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "results_final" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "creator_id",
ADD COLUMN     "identity_id" UUID,
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "results" DROP COLUMN "complete",
ADD COLUMN     "final" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "next_retry_at" TIMESTAMP(3),
ADD COLUMN     "retry_attempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "steps" ADD COLUMN     "can_be_manually_ended" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "identities_telegram" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "photo_url" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,

    CONSTRAINT "identities_telegram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups_telegram_chat" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "group_id" UUID NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "message_thread_id" BIGINT,
    "admin_telegram_user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_telegram_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_messages" (
    "id" UUID NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "message_id" BIGINT NOT NULL,
    "poll_id" BIGINT,
    "request_step_id" UUID NOT NULL,
    "field_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identities_telegram_identity_id_key" ON "identities_telegram"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_telegram_telegram_user_id_key" ON "identities_telegram"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_telegram_chat_group_id_key" ON "groups_telegram_chat"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_telegram_chat_chat_id_key" ON "groups_telegram_chat"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_messages_message_id_key" ON "telegram_messages"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_messages_poll_id_key" ON "telegram_messages"("poll_id");

-- CreateIndex
CREATE UNIQUE INDEX "results_request_step_id_result_config_id_key" ON "results"("request_step_id", "result_config_id");

-- AddForeignKey
ALTER TABLE "identities_telegram" ADD CONSTRAINT "identities_telegram_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_telegram_chat" ADD CONSTRAINT "groups_telegram_chat_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_custom" ADD CONSTRAINT "groups_custom_notification_entity_id_fkey" FOREIGN KEY ("notification_entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_messages" ADD CONSTRAINT "telegram_messages_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_messages" ADD CONSTRAINT "telegram_messages_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
