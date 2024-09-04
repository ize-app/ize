/*
  Warnings:

  - You are about to drop the column `has_request_options` on the `field_options_configs` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'EvolveGroup';

-- AlterEnum
ALTER TYPE "FlowType" ADD VALUE 'EvolveGroup';

-- AlterTable
ALTER TABLE "field_options_configs" DROP COLUMN "has_request_options";
