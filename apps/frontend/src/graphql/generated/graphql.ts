/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DiscordApiServer = {
  __typename?: 'DiscordAPIServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordApiServerRole = {
  __typename?: 'DiscordAPIServerRole';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordData = {
  __typename?: 'DiscordData';
  avatar: Scalars['String']['output'];
  discordId: Scalars['String']['output'];
  discriminator?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type DiscordRoleGroup = {
  __typename?: 'DiscordRoleGroup';
  discordRoleId: Scalars['String']['output'];
  discordServer: OnboardedDiscordServer;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  banner?: Maybe<Scalars['String']['output']>;
  creator: User;
  discordRoleGroup?: Maybe<DiscordRoleGroup>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  type?: Maybe<GroupType>;
};

export enum GroupType {
  DiscordRole = 'DiscordRole',
  Standard = 'Standard'
}

export type LogOutResponse = {
  __typename?: 'LogOutResponse';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  logOut?: Maybe<LogOutResponse>;
  setUpDiscordServer: Group;
};


export type MutationSetUpDiscordServerArgs = {
  input: SetUpDiscordServerInput;
};

export type OnboardedDiscordServer = {
  __typename?: 'OnboardedDiscordServer';
  discordServerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  discordServers: Array<DiscordApiServer>;
  group?: Maybe<Group>;
  groupsForCurrentUser: Array<Group>;
  me?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  discordData?: Maybe<DiscordData>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type SetUpDiscordServerInput = {
  serverId: Scalars['String']['input'];
};

export type DiscordServersQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscordServersQuery = { __typename?: 'Query', discordServers: Array<{ __typename?: 'DiscordAPIServer', id: string, name: string }> };

export type DiscordServerRolesQueryVariables = Exact<{
  serverId: Scalars['String']['input'];
}>;


export type DiscordServerRolesQuery = { __typename?: 'Query', discordServerRoles: Array<{ __typename?: 'DiscordAPIServerRole', id: string, name: string }> };

export type DiscordServerPartsFragment = { __typename?: 'DiscordAPIServer', id: string, name: string };

export type DiscordServerRolePartsFragment = { __typename?: 'DiscordAPIServerRole', id: string, name: string };

export type SetUpDiscordServerGroupMutationVariables = Exact<{
  input: SetUpDiscordServerInput;
}>;


export type SetUpDiscordServerGroupMutation = { __typename?: 'Mutation', setUpDiscordServer: { __typename?: 'Group', id: string } };

export type GroupQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GroupQuery = { __typename?: 'Query', group?: { __typename?: 'Group', id: string } | null };

export type GroupSummaryPartsFragment = { __typename?: 'Group', id: string, name: string, type?: GroupType | null, memberCount?: number | null, icon?: string | null, creator: { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } | null }, discordRoleGroup?: { __typename?: 'DiscordRoleGroup', id: string, name: string, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string } } | null };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsQuery = { __typename?: 'Query', groupsForCurrentUser: Array<{ __typename?: 'Group', id: string, name: string, type?: GroupType | null, memberCount?: number | null, icon?: string | null, creator: { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } | null }, discordRoleGroup?: { __typename?: 'DiscordRoleGroup', id: string, name: string, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string } } | null }> };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', logOut?: { __typename?: 'LogOutResponse', ok: boolean, error?: string | null } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } | null } | null> | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } | null } | null };

export type UserPartsFragment = { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } | null };

export type DiscordDataPartsFragment = { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string };

export const DiscordServerPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerPartsFragment, unknown>;
export const DiscordServerRolePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerRolePartsFragment, unknown>;
export const DiscordDataPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<DiscordDataPartsFragment, unknown>;
export const UserPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<UserPartsFragment, unknown>;
export const GroupSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<GroupSummaryPartsFragment, unknown>;
export const DiscordServersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServersQuery, DiscordServersQueryVariables>;
export const DiscordServerRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServerRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServerRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerRoleParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerRolesQuery, DiscordServerRolesQueryVariables>;
export const SetUpDiscordServerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUpDiscordServerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"setUpDiscordServerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setUpDiscordServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetUpDiscordServerGroupMutation, SetUpDiscordServerGroupMutationVariables>;
export const GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Group"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GroupQuery, GroupQueryVariables>;
export const GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupsForCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}}]}}]}}]}}]} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DiscordApiServer = {
  __typename?: 'DiscordAPIServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordApiServerRole = {
  __typename?: 'DiscordAPIServerRole';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordData = {
  __typename?: 'DiscordData';
  avatar: Scalars['String']['output'];
  discordId: Scalars['String']['output'];
  discriminator?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type DiscordRoleGroup = {
  __typename?: 'DiscordRoleGroup';
  discordRoleId: Scalars['String']['output'];
  discordServer: OnboardedDiscordServer;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  banner?: Maybe<Scalars['String']['output']>;
  creator: User;
  discordRoleGroup?: Maybe<DiscordRoleGroup>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  type?: Maybe<GroupType>;
};

export enum GroupType {
  DiscordRole = 'DiscordRole',
  Standard = 'Standard'
}

export type LogOutResponse = {
  __typename?: 'LogOutResponse';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  logOut?: Maybe<LogOutResponse>;
  setUpDiscordServer: Group;
};


export type MutationSetUpDiscordServerArgs = {
  input: SetUpDiscordServerInput;
};

export type OnboardedDiscordServer = {
  __typename?: 'OnboardedDiscordServer';
  discordServerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  discordServers: Array<DiscordApiServer>;
  group?: Maybe<Group>;
  groupsForCurrentUser: Array<Group>;
  me?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  discordData?: Maybe<DiscordData>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type SetUpDiscordServerInput = {
  serverId: Scalars['String']['input'];
};
