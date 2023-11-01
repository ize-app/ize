/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query DiscordServers {\n  discordServers {\n    ...DiscordServerParts\n  }\n}\n\nquery DiscordServerRoles($serverId: String!) {\n  discordServerRoles(serverId: $serverId) {\n    ...DiscordServerRoleParts\n  }\n}\n\nfragment DiscordServerParts on DiscordAPIServer {\n  id\n  name\n}\n\nfragment DiscordServerRoleParts on DiscordAPIServerRole {\n  id\n  name\n  botRole\n}": types.DiscordServersDocument,
    "mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  color\n  createdAt\n  organization {\n    ...OrganizationParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}": types.SetUpDiscordServerGroupDocument,
    "mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}": types.LogOutDocument,
    "mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}\n\nquery Process($processId: String!) {\n  process(processId: $processId) {\n    ...ProcessSummaryParts\n  }\n}\n\nfragment ProcessSummaryParts on Process {\n  id\n  currentProcessVersionId\n  name\n  description\n  expirationSeconds\n  webhookUri\n  options {\n    ...OptionSummaryParts\n  }\n  inputs {\n    ...InputTemplateSummaryParts\n  }\n  roles {\n    ...RoleSummaryParts\n  }\n  decisionSystem {\n    ...DecisionTypesSummaryParts\n  }\n  createdAt\n}\n\nfragment AgentSummaryParts on Agent {\n  __typename\n  ... on Group {\n    ...GroupSummaryParts\n  }\n  ... on User {\n    ...UserSummaryParts\n  }\n}\n\nfragment OptionSummaryParts on ProcessOption {\n  id\n  value\n  type\n}\n\nfragment InputTemplateSummaryParts on InputTemplate {\n  id\n  name\n  type\n  description\n  required\n}\n\nfragment RoleSummaryParts on Roles {\n  request {\n    ...AgentSummaryParts\n  }\n  respond {\n    ...AgentSummaryParts\n  }\n  edit {\n    ...AgentSummaryParts\n  }\n}\n\nfragment AbsoluteDecisionSummaryParts on AbsoluteDecision {\n  threshold\n}\n\nfragment PercentageDecisionSummaryParts on PercentageDecision {\n  quorum\n  percentage\n}\n\nfragment DecisionTypesSummaryParts on DecisionTypes {\n  __typename\n  ... on AbsoluteDecision {\n    threshold\n  }\n  ... on PercentageDecision {\n    quorum\n    percentage\n  }\n}": types.NewProcessDocument,
    "query Me {\n  me {\n    ...MeParts\n  }\n}\n\nfragment MeParts on Me {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment UserSummaryParts on User {\n  id\n  name\n  icon\n  createdAt\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DiscordServers {\n  discordServers {\n    ...DiscordServerParts\n  }\n}\n\nquery DiscordServerRoles($serverId: String!) {\n  discordServerRoles(serverId: $serverId) {\n    ...DiscordServerRoleParts\n  }\n}\n\nfragment DiscordServerParts on DiscordAPIServer {\n  id\n  name\n}\n\nfragment DiscordServerRoleParts on DiscordAPIServerRole {\n  id\n  name\n  botRole\n}"): (typeof documents)["query DiscordServers {\n  discordServers {\n    ...DiscordServerParts\n  }\n}\n\nquery DiscordServerRoles($serverId: String!) {\n  discordServerRoles(serverId: $serverId) {\n    ...DiscordServerRoleParts\n  }\n}\n\nfragment DiscordServerParts on DiscordAPIServer {\n  id\n  name\n}\n\nfragment DiscordServerRoleParts on DiscordAPIServerRole {\n  id\n  name\n  botRole\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  color\n  createdAt\n  organization {\n    ...OrganizationParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}"): (typeof documents)["mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  color\n  createdAt\n  organization {\n    ...OrganizationParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}"): (typeof documents)["mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}\n\nquery Process($processId: String!) {\n  process(processId: $processId) {\n    ...ProcessSummaryParts\n  }\n}\n\nfragment ProcessSummaryParts on Process {\n  id\n  currentProcessVersionId\n  name\n  description\n  expirationSeconds\n  webhookUri\n  options {\n    ...OptionSummaryParts\n  }\n  inputs {\n    ...InputTemplateSummaryParts\n  }\n  roles {\n    ...RoleSummaryParts\n  }\n  decisionSystem {\n    ...DecisionTypesSummaryParts\n  }\n  createdAt\n}\n\nfragment AgentSummaryParts on Agent {\n  __typename\n  ... on Group {\n    ...GroupSummaryParts\n  }\n  ... on User {\n    ...UserSummaryParts\n  }\n}\n\nfragment OptionSummaryParts on ProcessOption {\n  id\n  value\n  type\n}\n\nfragment InputTemplateSummaryParts on InputTemplate {\n  id\n  name\n  type\n  description\n  required\n}\n\nfragment RoleSummaryParts on Roles {\n  request {\n    ...AgentSummaryParts\n  }\n  respond {\n    ...AgentSummaryParts\n  }\n  edit {\n    ...AgentSummaryParts\n  }\n}\n\nfragment AbsoluteDecisionSummaryParts on AbsoluteDecision {\n  threshold\n}\n\nfragment PercentageDecisionSummaryParts on PercentageDecision {\n  quorum\n  percentage\n}\n\nfragment DecisionTypesSummaryParts on DecisionTypes {\n  __typename\n  ... on AbsoluteDecision {\n    threshold\n  }\n  ... on PercentageDecision {\n    quorum\n    percentage\n  }\n}"): (typeof documents)["mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}\n\nquery Process($processId: String!) {\n  process(processId: $processId) {\n    ...ProcessSummaryParts\n  }\n}\n\nfragment ProcessSummaryParts on Process {\n  id\n  currentProcessVersionId\n  name\n  description\n  expirationSeconds\n  webhookUri\n  options {\n    ...OptionSummaryParts\n  }\n  inputs {\n    ...InputTemplateSummaryParts\n  }\n  roles {\n    ...RoleSummaryParts\n  }\n  decisionSystem {\n    ...DecisionTypesSummaryParts\n  }\n  createdAt\n}\n\nfragment AgentSummaryParts on Agent {\n  __typename\n  ... on Group {\n    ...GroupSummaryParts\n  }\n  ... on User {\n    ...UserSummaryParts\n  }\n}\n\nfragment OptionSummaryParts on ProcessOption {\n  id\n  value\n  type\n}\n\nfragment InputTemplateSummaryParts on InputTemplate {\n  id\n  name\n  type\n  description\n  required\n}\n\nfragment RoleSummaryParts on Roles {\n  request {\n    ...AgentSummaryParts\n  }\n  respond {\n    ...AgentSummaryParts\n  }\n  edit {\n    ...AgentSummaryParts\n  }\n}\n\nfragment AbsoluteDecisionSummaryParts on AbsoluteDecision {\n  threshold\n}\n\nfragment PercentageDecisionSummaryParts on PercentageDecision {\n  quorum\n  percentage\n}\n\nfragment DecisionTypesSummaryParts on DecisionTypes {\n  __typename\n  ... on AbsoluteDecision {\n    threshold\n  }\n  ... on PercentageDecision {\n    quorum\n    percentage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...MeParts\n  }\n}\n\nfragment MeParts on Me {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment UserSummaryParts on User {\n  id\n  name\n  icon\n  createdAt\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}"): (typeof documents)["query Me {\n  me {\n    ...MeParts\n  }\n}\n\nfragment MeParts on Me {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment UserSummaryParts on User {\n  id\n  name\n  icon\n  createdAt\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;