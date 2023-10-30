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
    "mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  type\n  color\n  createdAt\n  creator {\n    ...UserParts\n  }\n  organization {\n    ...OrganizationParts\n  }\n  discordRoleGroup {\n    ...DiscordRoleGroupParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}": types.SetUpDiscordServerGroupDocument,
    "mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}": types.LogOutDocument,
    "mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}": types.NewProcessDocument,
    "query Users {\n  users {\n    ...UserParts\n  }\n}\n\nquery Me {\n  me {\n    ...UserParts\n  }\n}\n\nfragment UserParts on User {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}": types.UsersDocument,
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
export function graphql(source: "mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  type\n  color\n  createdAt\n  creator {\n    ...UserParts\n  }\n  organization {\n    ...OrganizationParts\n  }\n  discordRoleGroup {\n    ...DiscordRoleGroupParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}"): (typeof documents)["mutation setUpDiscordServerGroup($input: setUpDiscordServerInput!) {\n  setUpDiscordServer(input: $input) {\n    id\n  }\n}\n\nquery Group($id: String!) {\n  group(id: $id) {\n    ...GroupSummaryParts\n  }\n}\n\nfragment GroupSummaryParts on Group {\n  id\n  name\n  icon\n  memberCount\n  type\n  color\n  createdAt\n  creator {\n    ...UserParts\n  }\n  organization {\n    ...OrganizationParts\n  }\n  discordRoleGroup {\n    ...DiscordRoleGroupParts\n  }\n}\n\nfragment DiscordRoleGroupParts on DiscordRoleGroup {\n  id\n  name\n  color\n  icon\n  discordRoleId\n  discordServer {\n    ...OnboardedDiscordServerParts\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  icon\n}\n\nfragment OnboardedDiscordServerParts on OnboardedDiscordServer {\n  id\n  discordServerId\n  name\n  icon\n}\n\nquery Groups {\n  groupsForCurrentUser {\n    ...GroupSummaryParts\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}"): (typeof documents)["mutation LogOut {\n  logOut {\n    ok\n    error\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}"): (typeof documents)["mutation NewProcess($process: newProcessArgs!) {\n  newProcess(process: $process)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Users {\n  users {\n    ...UserParts\n  }\n}\n\nquery Me {\n  me {\n    ...UserParts\n  }\n}\n\nfragment UserParts on User {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}"): (typeof documents)["query Users {\n  users {\n    ...UserParts\n  }\n}\n\nquery Me {\n  me {\n    ...UserParts\n  }\n}\n\nfragment UserParts on User {\n  id\n  name\n  discordData {\n    ...DiscordDataParts\n  }\n}\n\nfragment DiscordDataParts on DiscordData {\n  id\n  username\n  discordId\n  discriminator\n  avatar\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;