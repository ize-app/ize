-- CreateEnum
CREATE TYPE "OauthTypes" AS ENUM ('Discord', 'Google');

-- CreateEnum
CREATE TYPE "NftTypes" AS ENUM ('ERC721', 'ERC1155');

-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('Ethereum', 'Arbitrum', 'Optimism', 'Matic', 'Base');

-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('Custom', 'Evolve');

-- CreateEnum
CREATE TYPE "FieldDataType" AS ENUM ('String', 'Number', 'Uri', 'Date', 'DateTime', 'FlowVersionId');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('Options', 'FreeInput');

-- CreateEnum
CREATE TYPE "OptionSelectionType" AS ENUM ('Rank', 'MultiSelect', 'Select');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('Decision', 'Ranking', 'LlmSummary', 'LlmSummaryList');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('NumberThreshold', 'PercentageThreshold', 'WeightedAverage');

-- CreateEnum
CREATE TYPE "LlmSummaryType" AS ENUM ('AfterEveryResponse', 'AtTheEnd');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CallWebhook', 'TriggerStep', 'EvolveFlow');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "stytch_id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_id" UUID NOT NULL,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities_email" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identities_email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities_blockchain" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "ens" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identities_blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities_discord" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identities_discord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities_groups" (
    "identity_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "oauths" (
    "user_id" UUID NOT NULL,
    "type" "OauthTypes" NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "id_token" TEXT,
    "scopes" JSONB[],
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauths_pkey" PRIMARY KEY ("user_id","type")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeAt" TIMESTAMP(3),
    "deactivatedat" TIMESTAMP(3),

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_role_groups" (
    "id" UUID NOT NULL,
    "discord_role_id" TEXT,
    "group_id" UUID NOT NULL,
    "discord_server_id" UUID NOT NULL,
    "color" INTEGER,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "unicode_emoji" TEXT,
    "member_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discord_role_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups_custom" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "group_id" UUID NOT NULL,

    CONSTRAINT "groups_custom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_group_group_members" (
    "group_id" UUID NOT NULL,
    "group_custom_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "custom_group_identity_members" (
    "identity_id" UUID NOT NULL,
    "group_custom_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "groups_nft" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "group_id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    "token_id" TEXT,

    CONSTRAINT "groups_nft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nft_collections" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "icon" TEXT,
    "chain" "Blockchain" NOT NULL,
    "type" "NftTypes" NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "nft_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_servers" (
    "id" UUID NOT NULL,
    "discord_server_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "banner" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discord_servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flows" (
    "id" UUID NOT NULL,
    "type" "FlowType" NOT NULL,
    "creator_id" UUID NOT NULL,
    "current_flow_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_versions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "reusable" BOOLEAN NOT NULL,
    "total_steps" INTEGER NOT NULL,
    "flow_id" UUID NOT NULL,
    "evolve_flow_id" UUID,
    "active" BOOLEAN NOT NULL,
    "draft_evolve_flow_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "flow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" UUID NOT NULL,
    "flow_version_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "request_expiration_seconds" INTEGER DEFAULT 0,
    "allow_multiple_responses" BOOLEAN NOT NULL DEFAULT false,
    "request_permissions_id" UUID,
    "response_permissions_id" UUID,
    "request_field_set_id" UUID,
    "response_field_set_id" UUID,
    "result_config_set_id" UUID,
    "action_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "entity_set_id" UUID,
    "anyone" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_set_entities" (
    "entity_set_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "entities" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_sets_fields" (
    "field_set_id" UUID NOT NULL,
    "field_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "fields" (
    "id" UUID NOT NULL,
    "type" "FieldType" NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "free_input_data_type" "FieldDataType",
    "field_options_config_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_options_configs" (
    "id" UUID NOT NULL,
    "field_option_set_id" UUID NOT NULL,
    "data_type" "FieldDataType",
    "has_request_options" BOOLEAN NOT NULL DEFAULT false,
    "previous_step_options" BOOLEAN NOT NULL DEFAULT false,
    "max_selections" INTEGER,
    "linked_result_options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "option_selection_type" "OptionSelectionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_options_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_option_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_option_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_option_set_field_options" (
    "field_option_set_id" UUID NOT NULL,
    "field_option_id" UUID NOT NULL,
    "index" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "field_options" (
    "id" UUID NOT NULL,
    "data_type" "FieldDataType" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "type" "FieldType" NOT NULL,
    "response_id" UUID,
    "request_step_id" UUID,
    "field_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_option_selections" (
    "id" UUID NOT NULL,
    "field_answer_id" UUID NOT NULL,
    "field_option_id" UUID NOT NULL,
    "answer_free_input_id" UUID,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_option_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_free_inputs" (
    "id" UUID NOT NULL,
    "data_type" "FieldDataType" NOT NULL,
    "field_answer_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_free_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_configs" (
    "id" UUID NOT NULL,
    "result_type" "ResultType" NOT NULL,
    "min_answers" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_id" UUID,
    "decision_id" UUID,
    "rank_id" UUID,
    "llm_id" UUID,

    CONSTRAINT "result_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_decisions" (
    "id" UUID NOT NULL,
    "type" "DecisionType" NOT NULL,
    "default_option_id" UUID,
    "threshold" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_rankings" (
    "id" UUID NOT NULL,
    "num_options" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_llms" (
    "id" UUID NOT NULL,
    "type" "LlmSummaryType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "example" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_llms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" UUID NOT NULL,
    "type" "ActionType" NOT NULL,
    "webhook_id" UUID,
    "filter_option_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_executions" (
    "id" UUID NOT NULL,
    "action_id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "last_attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "flow_version_id" UUID NOT NULL,
    "current_request_step_id" UUID,
    "name" TEXT NOT NULL,
    "final" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposed_flow_version_id" UUID,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_steps" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "final" BOOLEAN NOT NULL DEFAULT false,
    "response_complete" BOOLEAN NOT NULL DEFAULT false,
    "results_complete" BOOLEAN NOT NULL DEFAULT false,
    "actions_complete" BOOLEAN NOT NULL DEFAULT false,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_defined_option_sets" (
    "id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "field_option_set_id" UUID NOT NULL,

    CONSTRAINT "request_defined_option_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_set_result_configs" (
    "result_config_set_id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "results" (
    "id" UUID NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "request_step_id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "has_result" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_items" (
    "id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "data_type" "FieldDataType" NOT NULL,
    "field_option_id" UUID,
    "resultId" UUID NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_stytch_id_key" ON "users"("stytch_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_entity_id_key" ON "identities"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_identity_id_key" ON "identities_email"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_email_key" ON "identities_email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identities_blockchain_identity_id_key" ON "identities_blockchain"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_blockchain_address_key" ON "identities_blockchain"("address");

-- CreateIndex
CREATE UNIQUE INDEX "identities_discord_identity_id_key" ON "identities_discord"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_groups_identity_id_group_id_key" ON "identities_groups"("identity_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_entity_id_key" ON "groups"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_role_groups_group_id_key" ON "discord_role_groups"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_role_groups_discord_server_id_discord_role_id_key" ON "discord_role_groups"("discord_server_id", "discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_role_groups_discord_server_id_name_key" ON "discord_role_groups"("discord_server_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_custom_group_id_key" ON "groups_custom"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_group_group_members_group_id_group_custom_id_key" ON "custom_group_group_members"("group_id", "group_custom_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_group_identity_members_identity_id_group_custom_id_key" ON "custom_group_identity_members"("identity_id", "group_custom_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_nft_group_id_key" ON "groups_nft"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_nft_collection_id_token_id_key" ON "groups_nft"("collection_id", "token_id");

-- CreateIndex
CREATE UNIQUE INDEX "nft_collections_chain_address_key" ON "nft_collections"("chain", "address");

-- CreateIndex
CREATE UNIQUE INDEX "discord_servers_discord_server_id_key" ON "discord_servers"("discord_server_id");

-- CreateIndex
CREATE UNIQUE INDEX "flows_current_flow_version_id_key" ON "flows"("current_flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_set_entities_entity_id_entity_set_id_key" ON "entity_set_entities"("entity_id", "entity_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_sets_fields_field_id_field_set_id_key" ON "field_sets_fields"("field_id", "field_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_option_set_field_options_field_option_id_field_option_key" ON "field_option_set_field_options"("field_option_id", "field_option_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_option_set_field_options_index_field_option_set_id_key" ON "field_option_set_field_options"("index", "field_option_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "answer_option_selections_answer_free_input_id_key" ON "answer_option_selections"("answer_free_input_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_executions_action_id_request_step_id_key" ON "action_executions"("action_id", "request_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "requests_current_request_step_id_key" ON "requests"("current_request_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "requests_proposed_flow_version_id_key" ON "requests"("proposed_flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_steps_step_id_request_id_key" ON "request_steps"("step_id", "request_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_config_set_result_configs_result_config_id_result_co_key" ON "result_config_set_result_configs"("result_config_id", "result_config_set_id");

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_email" ADD CONSTRAINT "identities_email_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_blockchain" ADD CONSTRAINT "identities_blockchain_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_discord" ADD CONSTRAINT "identities_discord_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_groups" ADD CONSTRAINT "identities_groups_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities_groups" ADD CONSTRAINT "identities_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauths" ADD CONSTRAINT "oauths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_role_groups" ADD CONSTRAINT "discord_role_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_role_groups" ADD CONSTRAINT "discord_role_groups_discord_server_id_fkey" FOREIGN KEY ("discord_server_id") REFERENCES "discord_servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_custom" ADD CONSTRAINT "groups_custom_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_group_group_members" ADD CONSTRAINT "custom_group_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_group_group_members" ADD CONSTRAINT "custom_group_group_members_group_custom_id_fkey" FOREIGN KEY ("group_custom_id") REFERENCES "groups_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_group_identity_members" ADD CONSTRAINT "custom_group_identity_members_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_group_identity_members" ADD CONSTRAINT "custom_group_identity_members_group_custom_id_fkey" FOREIGN KEY ("group_custom_id") REFERENCES "groups_custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_nft" ADD CONSTRAINT "groups_nft_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups_nft" ADD CONSTRAINT "groups_nft_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "nft_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_current_flow_version_id_fkey" FOREIGN KEY ("current_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_evolve_flow_id_fkey" FOREIGN KEY ("evolve_flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_draft_evolve_flow_version_id_fkey" FOREIGN KEY ("draft_evolve_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_request_permissions_id_fkey" FOREIGN KEY ("request_permissions_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_request_field_set_id_fkey" FOREIGN KEY ("request_field_set_id") REFERENCES "field_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_response_field_set_id_fkey" FOREIGN KEY ("response_field_set_id") REFERENCES "field_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_response_permissions_id_fkey" FOREIGN KEY ("response_permissions_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_result_config_set_id_fkey" FOREIGN KEY ("result_config_set_id") REFERENCES "result_config_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_set_entities" ADD CONSTRAINT "entity_set_entities_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_set_entities" ADD CONSTRAINT "entity_set_entities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_sets_fields" ADD CONSTRAINT "field_sets_fields_field_set_id_fkey" FOREIGN KEY ("field_set_id") REFERENCES "field_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_sets_fields" ADD CONSTRAINT "field_sets_fields_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_field_options_config_id_fkey" FOREIGN KEY ("field_options_config_id") REFERENCES "field_options_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options_configs" ADD CONSTRAINT "field_options_configs_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_option_set_field_options" ADD CONSTRAINT "field_option_set_field_options_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_option_set_field_options" ADD CONSTRAINT "field_option_set_field_options_field_option_id_fkey" FOREIGN KEY ("field_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_selections" ADD CONSTRAINT "answer_option_selections_field_option_id_fkey" FOREIGN KEY ("field_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_selections" ADD CONSTRAINT "answer_option_selections_field_answer_id_fkey" FOREIGN KEY ("field_answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_selections" ADD CONSTRAINT "answer_option_selections_answer_free_input_id_fkey" FOREIGN KEY ("answer_free_input_id") REFERENCES "answer_free_inputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_free_inputs" ADD CONSTRAINT "answer_free_inputs_field_answer_id_fkey" FOREIGN KEY ("field_answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "result_config_decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "result_config_rankings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_llm_id_fkey" FOREIGN KEY ("llm_id") REFERENCES "result_config_llms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_decisions" ADD CONSTRAINT "result_config_decisions_default_option_id_fkey" FOREIGN KEY ("default_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_filter_option_id_fkey" FOREIGN KEY ("filter_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_proposed_flow_version_id_fkey" FOREIGN KEY ("proposed_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_current_request_step_id_fkey" FOREIGN KEY ("current_request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_steps" ADD CONSTRAINT "request_steps_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_steps" ADD CONSTRAINT "request_steps_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_set_result_configs" ADD CONSTRAINT "result_config_set_result_configs_result_config_set_id_fkey" FOREIGN KEY ("result_config_set_id") REFERENCES "result_config_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_set_result_configs" ADD CONSTRAINT "result_config_set_result_configs_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_items" ADD CONSTRAINT "result_items_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_items" ADD CONSTRAINT "result_items_field_option_id_fkey" FOREIGN KEY ("field_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

