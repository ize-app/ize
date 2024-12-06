-- CreateEnum
CREATE TYPE "OauthTypes" AS ENUM ('Discord', 'Google');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('DiscordRoleGroup', 'GroupNft', 'GroupTelegram', 'GroupIze');

-- CreateEnum
CREATE TYPE "NftTypes" AS ENUM ('ERC721', 'ERC1155');

-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('Ethereum', 'Arbitrum', 'Optimism', 'Matic', 'Base');

-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('Custom', 'Evolve', 'EvolveGroup', 'GroupWatchFlow');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('OptionSelections', 'String', 'Float', 'Uri', 'Date', 'DateTime', 'FlowVersion', 'Entities', 'Flows');

-- CreateEnum
CREATE TYPE "SystemFieldType" AS ENUM ('EvolveFlowProposed', 'EvolveFlowCurrent', 'EvolveFlowDescription', 'GroupName', 'GroupDescription', 'GroupMembers', 'WatchFlow', 'UnwatchFlow');

-- CreateEnum
CREATE TYPE "OptionSelectionType" AS ENUM ('None', 'Rank', 'Select');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('RawAnswers', 'Decision', 'Ranking', 'LlmSummary');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('NumberThreshold', 'PercentageThreshold', 'WeightedAverage', 'Ai');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CallWebhook', 'TriggerStep', 'EvolveFlow', 'EvolveGroup', 'GroupWatchFlow');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "stytch_id" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
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
CREATE TABLE "identity_emails" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_blockchain_addresses" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "ens" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_blockchain_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_discord_users" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_discord_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_telegram_users" (
    "id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "photo_url" TEXT,

    CONSTRAINT "identity_telegram_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities_groups" (
    "entity_id" UUID NOT NULL,
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
    "creator_entity_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "type" "GroupType" NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_discord_roles" (
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

    CONSTRAINT "group_discord_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_telegram_chats" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "message_thread_id" BIGINT,
    "admin_telegram_user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_telegram_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_ize_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "group_id" UUID NOT NULL,
    "entity_set_id" UUID NOT NULL,
    "notification_entity_id" UUID,

    CONSTRAINT "group_ize_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_nfts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "group_id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    "token_id" TEXT,

    CONSTRAINT "group_nfts_pkey" PRIMARY KEY ("id")
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
    "custom_group_id" UUID,
    "type" "FlowType" NOT NULL,
    "reusable" BOOLEAN NOT NULL,
    "creator_entity_id" UUID NOT NULL,
    "current_flow_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_versions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "flow_id" UUID NOT NULL,
    "evolve_flow_id" UUID,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_configs" (
    "id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_expiration_seconds" INTEGER NOT NULL DEFAULT 0,
    "can_be_manually_ended" BOOLEAN NOT NULL DEFAULT false,
    "allow_multiple_responses" BOOLEAN NOT NULL DEFAULT false,
    "min_responses" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "response_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "response_config_id" UUID,
    "flow_version_id" UUID,
    "anyone" BOOLEAN NOT NULL DEFAULT false,
    "entity_set_id" UUID,
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
CREATE TABLE "values" (
    "id" UUID NOT NULL,
    "type" "ValueType" NOT NULL,
    "string" TEXT,
    "float" DOUBLE PRECISION,
    "date" DATE,
    "dateTime" TIMESTAMP(3),
    "flow_version_id" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "values_option_selections" (
    "id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "values_option_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "values_flows" (
    "id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,

    CONSTRAINT "values_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "values_entities" (
    "id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL,

    CONSTRAINT "values_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_sets" (
    "id" UUID NOT NULL,
    "entity_id" UUID,
    "flow_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "field_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" UUID NOT NULL,
    "field_set_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ValueType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "system_field_type" "SystemFieldType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_options_configs" (
    "id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "trigger_options_type" "ValueType",
    "max_selections" INTEGER,
    "option_selection_type" "OptionSelectionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "field_option_set_id" UUID NOT NULL,

    CONSTRAINT "field_options_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_options_configs_linked_results" (
    "id" UUID NOT NULL,
    "field_options_config_id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,

    CONSTRAINT "field_options_configs_linked_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_option_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_option_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_options" (
    "id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "field_option_set_id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "response_id" UUID,
    "request_id" UUID,
    "field_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_sets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "step_id" UUID NOT NULL,

    CONSTRAINT "result_config_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_configs" (
    "id" UUID NOT NULL,
    "result_config_set_id" UUID NOT NULL,
    "field_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "result_type" "ResultType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_decisions" (
    "id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "type" "DecisionType" NOT NULL,
    "default_option_id" UUID,
    "threshold" INTEGER,
    "criteria" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_rankings" (
    "id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "num_options" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_config_llms" (
    "id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "is_list" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_config_llms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_config_sets" (
    "id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_config_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_configs" (
    "id" UUID NOT NULL,
    "action_config_set_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_config_filters" (
    "id" UUID NOT NULL,
    "action_config_id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "filter_option_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_config_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_config_trigger_steps" (
    "id" UUID NOT NULL,
    "action_config_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_config_trigger_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_config_webhooks" (
    "id" UUID NOT NULL,
    "action_config_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "uri_preview" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_config_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" UUID NOT NULL,
    "action_config_id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "last_attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retry_attempts" INTEGER NOT NULL DEFAULT 0,
    "next_retry_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL,
    "creator_entity_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "final" BOOLEAN NOT NULL DEFAULT false,
    "flow_version_id" UUID NOT NULL,
    "current_request_step_id" UUID,
    "proposed_flow_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_steps" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "response_final" BOOLEAN NOT NULL DEFAULT false,
    "results_final" BOOLEAN NOT NULL DEFAULT false,
    "actions_final" BOOLEAN NOT NULL DEFAULT false,
    "final" BOOLEAN NOT NULL DEFAULT false,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "triggered_by_request_step_id" UUID,
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
    "is_trigger_defined" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_defined_option_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_groups" (
    "id" UUID NOT NULL,
    "request_step_id" UUID NOT NULL,
    "result_config_id" UUID NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "retry_attempts" INTEGER NOT NULL DEFAULT 0,
    "next_retry_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" UUID NOT NULL,
    "result_group_id" UUID NOT NULL,
    "result_type" "ResultType" NOT NULL,
    "name" TEXT NOT NULL,
    "answer_count" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_items" (
    "id" UUID NOT NULL,
    "value_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "field_option_id" UUID,
    "resultId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_watched_groups" (
    "entity_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "watched" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "entity_watched_flows" (
    "entity_id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "watched" BOOLEAN NOT NULL
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
CREATE UNIQUE INDEX "users_stytch_id_key" ON "users"("stytch_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_entity_id_key" ON "users"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_entity_id_key" ON "identities"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_emails_identity_id_key" ON "identity_emails"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_emails_email_key" ON "identity_emails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identity_blockchain_addresses_identity_id_key" ON "identity_blockchain_addresses"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_blockchain_addresses_address_key" ON "identity_blockchain_addresses"("address");

-- CreateIndex
CREATE UNIQUE INDEX "identity_discord_users_identity_id_key" ON "identity_discord_users"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_telegram_users_identity_id_key" ON "identity_telegram_users"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_telegram_users_telegram_user_id_key" ON "identity_telegram_users"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "entities_groups_entity_id_group_id_key" ON "entities_groups"("entity_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_entity_id_key" ON "groups"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_discord_roles_group_id_key" ON "group_discord_roles"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_discord_roles_discord_server_id_discord_role_id_key" ON "group_discord_roles"("discord_server_id", "discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_discord_roles_discord_server_id_name_key" ON "group_discord_roles"("discord_server_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "group_telegram_chats_group_id_key" ON "group_telegram_chats"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_telegram_chats_chat_id_key" ON "group_telegram_chats"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_ize_groups_group_id_key" ON "group_ize_groups"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_nfts_group_id_key" ON "group_nfts"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_nfts_collection_id_token_id_key" ON "group_nfts"("collection_id", "token_id");

-- CreateIndex
CREATE UNIQUE INDEX "nft_collections_chain_address_key" ON "nft_collections"("chain", "address");

-- CreateIndex
CREATE UNIQUE INDEX "discord_servers_discord_server_id_key" ON "discord_servers"("discord_server_id");

-- CreateIndex
CREATE UNIQUE INDEX "flows_current_flow_version_id_key" ON "flows"("current_flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "response_configs_step_id_key" ON "response_configs"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_response_config_id_key" ON "permissions"("response_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_flow_version_id_key" ON "permissions"("flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_entity_set_id_key" ON "permissions"("entity_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_set_entities_entity_id_entity_set_id_key" ON "entity_set_entities"("entity_id", "entity_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_sets_entity_id_key" ON "field_sets"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_sets_flow_version_id_key" ON "field_sets"("flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "fields_index_field_set_id_key" ON "fields"("index", "field_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_options_configs_field_id_key" ON "field_options_configs"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_options_configs_linked_results_field_options_config_i_key" ON "field_options_configs_linked_results"("field_options_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_options_index_field_option_set_id_key" ON "field_options"("index", "field_option_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_config_sets_step_id_key" ON "result_config_sets"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_configs_index_result_config_set_id_key" ON "result_configs"("index", "result_config_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_config_decisions_result_config_id_key" ON "result_config_decisions"("result_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_config_rankings_result_config_id_key" ON "result_config_rankings"("result_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_config_llms_result_config_id_key" ON "result_config_llms"("result_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_config_sets_step_id_key" ON "action_config_sets"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_configs_index_action_config_set_id_key" ON "action_configs"("index", "action_config_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_config_filters_action_config_id_key" ON "action_config_filters"("action_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_config_trigger_steps_action_config_id_key" ON "action_config_trigger_steps"("action_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_config_webhooks_action_config_id_key" ON "action_config_webhooks"("action_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_action_config_id_request_step_id_key" ON "actions"("action_config_id", "request_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "requests_current_request_step_id_key" ON "requests"("current_request_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "requests_proposed_flow_version_id_key" ON "requests"("proposed_flow_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_steps_step_id_request_id_key" ON "request_steps"("step_id", "request_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_defined_option_sets_field_id_request_step_id_field__key" ON "request_defined_option_sets"("field_id", "request_step_id", "field_option_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "result_groups_request_step_id_result_config_id_key" ON "result_groups"("request_step_id", "result_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_watched_groups_entity_id_group_id_key" ON "entity_watched_groups"("entity_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "entity_watched_flows_entity_id_flow_id_key" ON "entity_watched_flows"("entity_id", "flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_messages_message_id_key" ON "telegram_messages"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_messages_poll_id_key" ON "telegram_messages"("poll_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_emails" ADD CONSTRAINT "identity_emails_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_blockchain_addresses" ADD CONSTRAINT "identity_blockchain_addresses_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_discord_users" ADD CONSTRAINT "identity_discord_users_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_telegram_users" ADD CONSTRAINT "identity_telegram_users_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities_groups" ADD CONSTRAINT "entities_groups_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities_groups" ADD CONSTRAINT "entities_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauths" ADD CONSTRAINT "oauths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creator_entity_id_fkey" FOREIGN KEY ("creator_entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_discord_roles" ADD CONSTRAINT "group_discord_roles_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_discord_roles" ADD CONSTRAINT "group_discord_roles_discord_server_id_fkey" FOREIGN KEY ("discord_server_id") REFERENCES "discord_servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_telegram_chats" ADD CONSTRAINT "group_telegram_chats_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_ize_groups" ADD CONSTRAINT "group_ize_groups_notification_entity_id_fkey" FOREIGN KEY ("notification_entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_ize_groups" ADD CONSTRAINT "group_ize_groups_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_ize_groups" ADD CONSTRAINT "group_ize_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_nfts" ADD CONSTRAINT "group_nfts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_nfts" ADD CONSTRAINT "group_nfts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "nft_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_creator_entity_id_fkey" FOREIGN KEY ("creator_entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_custom_group_id_fkey" FOREIGN KEY ("custom_group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_current_flow_version_id_fkey" FOREIGN KEY ("current_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_evolve_flow_id_fkey" FOREIGN KEY ("evolve_flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_draft_evolve_flow_version_id_fkey" FOREIGN KEY ("draft_evolve_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_configs" ADD CONSTRAINT "response_configs_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_response_config_id_fkey" FOREIGN KEY ("response_config_id") REFERENCES "response_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_set_entities" ADD CONSTRAINT "entity_set_entities_entity_set_id_fkey" FOREIGN KEY ("entity_set_id") REFERENCES "entity_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_set_entities" ADD CONSTRAINT "entity_set_entities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values" ADD CONSTRAINT "values_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_option_selections" ADD CONSTRAINT "values_option_selections_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_option_selections" ADD CONSTRAINT "values_option_selections_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_flows" ADD CONSTRAINT "values_flows_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_flows" ADD CONSTRAINT "values_flows_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_entities" ADD CONSTRAINT "values_entities_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "values_entities" ADD CONSTRAINT "values_entities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_sets" ADD CONSTRAINT "field_sets_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_sets" ADD CONSTRAINT "field_sets_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_field_set_id_fkey" FOREIGN KEY ("field_set_id") REFERENCES "field_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options_configs" ADD CONSTRAINT "field_options_configs_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options_configs" ADD CONSTRAINT "field_options_configs_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options_configs_linked_results" ADD CONSTRAINT "field_options_configs_linked_results_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options_configs_linked_results" ADD CONSTRAINT "field_options_configs_linked_results_field_options_config__fkey" FOREIGN KEY ("field_options_config_id") REFERENCES "field_options_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options" ADD CONSTRAINT "field_options_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_options" ADD CONSTRAINT "field_options_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_sets" ADD CONSTRAINT "result_config_sets_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_result_config_set_id_fkey" FOREIGN KEY ("result_config_set_id") REFERENCES "result_config_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_configs" ADD CONSTRAINT "result_configs_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_decisions" ADD CONSTRAINT "result_config_decisions_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_decisions" ADD CONSTRAINT "result_config_decisions_default_option_id_fkey" FOREIGN KEY ("default_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_rankings" ADD CONSTRAINT "result_config_rankings_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_config_llms" ADD CONSTRAINT "result_config_llms_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_sets" ADD CONSTRAINT "action_config_sets_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_configs" ADD CONSTRAINT "action_configs_action_config_set_id_fkey" FOREIGN KEY ("action_config_set_id") REFERENCES "action_config_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_filters" ADD CONSTRAINT "action_config_filters_action_config_id_fkey" FOREIGN KEY ("action_config_id") REFERENCES "action_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_filters" ADD CONSTRAINT "action_config_filters_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_filters" ADD CONSTRAINT "action_config_filters_filter_option_id_fkey" FOREIGN KEY ("filter_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_trigger_steps" ADD CONSTRAINT "action_config_trigger_steps_action_config_id_fkey" FOREIGN KEY ("action_config_id") REFERENCES "action_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_trigger_steps" ADD CONSTRAINT "action_config_trigger_steps_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_config_webhooks" ADD CONSTRAINT "action_config_webhooks_action_config_id_fkey" FOREIGN KEY ("action_config_id") REFERENCES "action_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_action_config_id_fkey" FOREIGN KEY ("action_config_id") REFERENCES "action_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_creator_entity_id_fkey" FOREIGN KEY ("creator_entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_flow_version_id_fkey" FOREIGN KEY ("flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_current_request_step_id_fkey" FOREIGN KEY ("current_request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_proposed_flow_version_id_fkey" FOREIGN KEY ("proposed_flow_version_id") REFERENCES "flow_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_steps" ADD CONSTRAINT "request_steps_triggered_by_request_step_id_fkey" FOREIGN KEY ("triggered_by_request_step_id") REFERENCES "request_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_steps" ADD CONSTRAINT "request_steps_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_steps" ADD CONSTRAINT "request_steps_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_defined_option_sets" ADD CONSTRAINT "request_defined_option_sets_field_option_set_id_fkey" FOREIGN KEY ("field_option_set_id") REFERENCES "field_option_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_groups" ADD CONSTRAINT "result_groups_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_groups" ADD CONSTRAINT "result_groups_result_config_id_fkey" FOREIGN KEY ("result_config_id") REFERENCES "result_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_result_group_id_fkey" FOREIGN KEY ("result_group_id") REFERENCES "result_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_items" ADD CONSTRAINT "result_items_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_items" ADD CONSTRAINT "result_items_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_items" ADD CONSTRAINT "result_items_field_option_id_fkey" FOREIGN KEY ("field_option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_watched_groups" ADD CONSTRAINT "entity_watched_groups_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_watched_groups" ADD CONSTRAINT "entity_watched_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_watched_flows" ADD CONSTRAINT "entity_watched_flows_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_watched_flows" ADD CONSTRAINT "entity_watched_flows_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_messages" ADD CONSTRAINT "telegram_messages_request_step_id_fkey" FOREIGN KEY ("request_step_id") REFERENCES "request_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_messages" ADD CONSTRAINT "telegram_messages_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

