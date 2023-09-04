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

export type CreateDiscordServerGroupInput = {
  numberOfResponses?: InputMaybe<Scalars['Int']['input']>;
  processConfigurationOption: ProcessConfigurationOption;
  roleId?: InputMaybe<Scalars['String']['input']>;
  serverId: Scalars['String']['input'];
};

export type DiscordData = {
  __typename?: 'DiscordData';
  avatar?: Maybe<Scalars['String']['output']>;
  discriminator?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type DiscordServer = {
  __typename?: 'DiscordServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordServerRole = {
  __typename?: 'DiscordServerRole';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDiscordServerGroup: Group;
};


export type MutationCreateDiscordServerGroupArgs = {
  input: CreateDiscordServerGroupInput;
};

export enum ProcessConfigurationOption {
  BenevolentDictator = 'BenevolentDictator',
  FullDecentralization = 'FullDecentralization',
  TrustedAdvisors = 'TrustedAdvisors'
}

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordServerRole>;
  discordServers: Array<DiscordServer>;
  me?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  discordData?: Maybe<DiscordData>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type DiscordServersQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscordServersQuery = { __typename?: 'Query', discordServers: Array<{ __typename?: 'DiscordServer', id: string, name: string }> };

export type DiscordServerRolesQueryVariables = Exact<{
  serverId: Scalars['String']['input'];
}>;


export type DiscordServerRolesQuery = { __typename?: 'Query', discordServerRoles: Array<{ __typename?: 'DiscordServerRole', id: string, name: string }> };

export type DiscordServerPartsFragment = { __typename?: 'DiscordServer', id: string, name: string };

export type DiscordServerRolePartsFragment = { __typename?: 'DiscordServerRole', id: string, name: string };

export type CreateDiscordServerGroupMutationVariables = Exact<{
  input: CreateDiscordServerGroupInput;
}>;


export type CreateDiscordServerGroupMutation = { __typename?: 'Mutation', createDiscordServerGroup: { __typename?: 'Group', id: string, name: string } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discriminator?: string | null, avatar?: string | null } | null } | null> | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discriminator?: string | null, avatar?: string | null } | null } | null };

export type UserPartsFragment = { __typename?: 'User', id: string, name?: string | null, discordData?: { __typename?: 'DiscordData', id: string, username: string, discriminator?: string | null, avatar?: string | null } | null };

export type DiscordDataPartsFragment = { __typename?: 'DiscordData', id: string, username: string, discriminator?: string | null, avatar?: string | null };

export const DiscordServerPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerPartsFragment, unknown>;
export const DiscordServerRolePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerRolePartsFragment, unknown>;
export const DiscordDataPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<DiscordDataPartsFragment, unknown>;
export const UserPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<UserPartsFragment, unknown>;
export const DiscordServersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServersQuery, DiscordServersQueryVariables>;
export const DiscordServerRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServerRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServerRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerRoleParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerRolesQuery, DiscordServerRolesQueryVariables>;
export const CreateDiscordServerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDiscordServerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDiscordServerGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDiscordServerGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateDiscordServerGroupMutation, CreateDiscordServerGroupMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;

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

export type CreateDiscordServerGroupInput = {
  numberOfResponses?: InputMaybe<Scalars['Int']['input']>;
  processConfigurationOption: ProcessConfigurationOption;
  roleId?: InputMaybe<Scalars['String']['input']>;
  serverId: Scalars['String']['input'];
};

export type DiscordData = {
  __typename?: 'DiscordData';
  avatar?: Maybe<Scalars['String']['output']>;
  discriminator?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type DiscordServer = {
  __typename?: 'DiscordServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordServerRole = {
  __typename?: 'DiscordServerRole';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDiscordServerGroup: Group;
};


export type MutationCreateDiscordServerGroupArgs = {
  input: CreateDiscordServerGroupInput;
};

export enum ProcessConfigurationOption {
  BenevolentDictator = 'BenevolentDictator',
  FullDecentralization = 'FullDecentralization',
  TrustedAdvisors = 'TrustedAdvisors'
}

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordServerRole>;
  discordServers: Array<DiscordServer>;
  me?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  discordData?: Maybe<DiscordData>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};
