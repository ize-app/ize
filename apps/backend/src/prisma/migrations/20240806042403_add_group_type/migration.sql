/*
  Warnings:

  - Added the required column `type` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('DiscordRoleGroup', 'GroupNft', 'GroupCustom');

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "type" "GroupType" NOT NULL;
