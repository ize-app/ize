/*
  Warnings:

  - You are about to drop the `custom_group_group_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_group_identity_members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `entity_set_id` to the `groups_custom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uri_preview` to the `webhooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActionType" ADD VALUE 'GroupUpdateMetadata';
ALTER TYPE "ActionType" ADD VALUE 'GroupUpdateMembership';
ALTER TYPE "ActionType" ADD VALUE 'GroupWatchFlow';
ALTER TYPE "ActionType" ADD VALUE 'GroupUpdateNotifications';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FieldDataType" ADD VALUE 'EntityIds';
ALTER TYPE "FieldDataType" ADD VALUE 'FlowIds';
ALTER TYPE "FieldDataType" ADD VALUE 'Webhook';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FlowType" ADD VALUE 'GroupUpdateMetadata';
ALTER TYPE "FlowType" ADD VALUE 'GroupUpdateMembership';
ALTER TYPE "FlowType" ADD VALUE 'GroupWatchFlow';
ALTER TYPE "FlowType" ADD VALUE 'GroupUpdateNotifications';

-- DropForeignKey
ALTER TABLE "custom_group_group_members" DROP CONSTRAINT "custom_group_group_members_group_custom_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_group_group_members" DROP CONSTRAINT "custom_group_group_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_group_identity_members" DROP CONSTRAINT "custom_group_identity_members_group_custom_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_group_identity_members" DROP CONSTRAINT "custom_group_identity_members_identity_id_fkey";

-- AlterTable
ALTER TABLE "actions" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "field_sets" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "flows" ADD COLUMN     "custom_group_id" UUID;

-- AlterTable
ALTER TABLE "groups_custom" ADD COLUMN     "description" TEXT,
ADD COLUMN     "entity_set_id" UUID NOT NULL,
ADD COLUMN     "notification_webhook_id" UUID;

-- AlterTable
ALTER TABLE "webhooks" ADD COLUMN     "uri_preview" TEXT NOT NULL;

-- DropTable
DROP TABLE "custom_group_group_members";

-- DropTable
DROP TABLE "custom_group_identity_members";

-- CreateTable
CREATE TABLE "users_watched_groups" (
    "user_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "watched" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "users_watched_flows" (
    "user_id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "watched" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "groups_watched_flows" (
    "flow_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "watched" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_watched_groups_user_id_group_id_key" ON "users_watched_groups"("user_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_watched_flows_user_id_flow_id_key" ON "users_watched_flows"("user_id", "flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_watched_flows_flow_id_group_id_key" ON "groups_watched_flows"("flow_id", "group_id");

-- AddForeignKey
ALTER TABLE "groups_custom" ADD CONSTRAINT "groups_custom_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_custom" ADD CONSTRAINT "groups_custom_notification_webhook_id_fkey" FOREIGN KEY ("notification_webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_custom_group_id_fkey" FOREIGN KEY ("custom_group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_watched_groups" ADD CONSTRAINT "users_watched_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_watched_groups" ADD CONSTRAINT "users_watched_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_watched_flows" ADD CONSTRAINT "users_watched_flows_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_watched_flows" ADD CONSTRAINT "users_watched_flows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_watched_flows" ADD CONSTRAINT "groups_watched_flows_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_watched_flows" ADD CONSTRAINT "groups_watched_flows_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
