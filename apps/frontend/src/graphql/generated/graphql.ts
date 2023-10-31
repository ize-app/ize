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

export type AbsoluteDecision = {
  __typename?: 'AbsoluteDecision';
  threshold: Scalars['Int']['output'];
};

export type AbsoluteDecisionArgs = {
  threshold: Scalars['Int']['input'];
};

export type Agent = Group | User;

export enum AgentType {
  Group = 'Group',
  User = 'User'
}

export type DecisionTypes = AbsoluteDecision | PercentageDecision;

export type DiscordApiServer = {
  __typename?: 'DiscordAPIServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordApiServerRole = {
  __typename?: 'DiscordAPIServerRole';
  botRole: Scalars['Boolean']['output'];
  color: Scalars['Int']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
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
  color?: Maybe<Scalars['Int']['output']>;
  discordRoleId: Scalars['String']['output'];
  discordServer: OnboardedDiscordServer;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  creator: User;
  discordRoleGroup: DiscordRoleGroup;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
};

export enum InputDataType {
  Float = 'Float',
  Int = 'Int',
  Text = 'Text',
  Uri = 'Uri'
}

export type InputTemplate = {
  __typename?: 'InputTemplate';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: InputDataType;
};

export type InputTemplateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  type: InputDataType;
};

export type LogOutResponse = {
  __typename?: 'LogOutResponse';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Me = {
  __typename?: 'Me';
  discordData: DiscordData;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  logOut?: Maybe<LogOutResponse>;
  newProcess: Scalars['String']['output'];
  setUpDiscordServer: Group;
};


export type MutationNewProcessArgs = {
  process: NewProcessArgs;
};


export type MutationSetUpDiscordServerArgs = {
  input: SetUpDiscordServerInput;
};

export type OnboardedDiscordServer = {
  __typename?: 'OnboardedDiscordServer';
  banner?: Maybe<Scalars['String']['output']>;
  discordServerId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum OptionType {
  Float = 'Float',
  Int = 'Int',
  Text = 'Text',
  Uri = 'Uri'
}

export type Organization = {
  __typename?: 'Organization';
  icon: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PercentageDecision = {
  __typename?: 'PercentageDecision';
  percentage: Scalars['Float']['output'];
  quorum: Scalars['Int']['output'];
};

export type PercentageDecisionArgs = {
  percentage: Scalars['Float']['input'];
  quorum: Scalars['Int']['input'];
};

export type Process = {
  __typename?: 'Process';
  createdAt: Scalars['String']['output'];
  creator: User;
  currentProcessVersionId: Scalars['String']['output'];
  decisionSystem: DecisionTypes;
  description?: Maybe<Scalars['String']['output']>;
  expirationSeconds: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  inputs: Array<InputTemplate>;
  name: Scalars['String']['output'];
  options: Array<ProcessOption>;
  roles: Roles;
  webhookUri?: Maybe<Scalars['String']['output']>;
};

export type ProcessOption = {
  __typename?: 'ProcessOption';
  id: Scalars['String']['output'];
  type: OptionType;
  value: Scalars['String']['output'];
};

export type ProcessOptionArgs = {
  type: OptionType;
  value: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  discordServers: Array<DiscordApiServer>;
  group: Group;
  groupsForCurrentUser: Array<Group>;
  me?: Maybe<Me>;
  process: Process;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};


export type QueryProcessArgs = {
  processId: Scalars['String']['input'];
};

export type RoleArgs = {
  agentType: AgentType;
  id: Scalars['String']['input'];
  type: RoleType;
};

export enum RoleType {
  Request = 'Request',
  Respond = 'Respond'
}

export type Roles = {
  __typename?: 'Roles';
  edit?: Maybe<Agent>;
  request: Array<Agent>;
  respond: Array<Agent>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  discordData: DiscordData;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type NewProcessArgs = {
  absoluteDecision?: InputMaybe<AbsoluteDecisionArgs>;
  description?: InputMaybe<Scalars['String']['input']>;
  editProcessId?: InputMaybe<Scalars['String']['input']>;
  expirationSeconds: Scalars['Int']['input'];
  inputs: Array<InputTemplateArgs>;
  name: Scalars['String']['input'];
  options: Array<ProcessOptionArgs>;
  percentageDecision?: InputMaybe<PercentageDecisionArgs>;
  roles: Array<RoleArgs>;
  webhookUri?: InputMaybe<Scalars['String']['input']>;
};

export type SetUpDiscordServerInput = {
  roleId?: InputMaybe<Scalars['String']['input']>;
  serverId: Scalars['String']['input'];
};

export type DiscordServersQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscordServersQuery = { __typename?: 'Query', discordServers: Array<{ __typename?: 'DiscordAPIServer', id: string, name: string }> };

export type DiscordServerRolesQueryVariables = Exact<{
  serverId: Scalars['String']['input'];
}>;


export type DiscordServerRolesQuery = { __typename?: 'Query', discordServerRoles: Array<{ __typename?: 'DiscordAPIServerRole', id: string, name: string, botRole: boolean }> };

export type DiscordServerPartsFragment = { __typename?: 'DiscordAPIServer', id: string, name: string };

export type DiscordServerRolePartsFragment = { __typename?: 'DiscordAPIServerRole', id: string, name: string, botRole: boolean };

export type SetUpDiscordServerGroupMutationVariables = Exact<{
  input: SetUpDiscordServerInput;
}>;


export type SetUpDiscordServerGroupMutation = { __typename?: 'Mutation', setUpDiscordServer: { __typename?: 'Group', id: string } };

export type GroupQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GroupQuery = { __typename?: 'Query', group: { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } };

export type GroupSummaryPartsFragment = { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } };

export type DiscordRoleGroupPartsFragment = { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } };

export type OrganizationPartsFragment = { __typename?: 'Organization', name: string, icon: string };

export type OnboardedDiscordServerPartsFragment = { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null };

export type GroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsQuery = { __typename?: 'Query', groupsForCurrentUser: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } }> };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', logOut?: { __typename?: 'LogOutResponse', ok: boolean, error?: string | null } | null };

export type NewProcessMutationVariables = Exact<{
  process: NewProcessArgs;
}>;


export type NewProcessMutation = { __typename?: 'Mutation', newProcess: string };

export type ProcessQueryVariables = Exact<{
  processId: Scalars['String']['input'];
}>;


export type ProcessQuery = { __typename?: 'Query', process: { __typename?: 'Process', id: string, currentProcessVersionId: string, name: string, description?: string | null, expirationSeconds: number, webhookUri?: string | null, createdAt: string, options: Array<{ __typename?: 'ProcessOption', id: string, value: string, type: OptionType }>, inputs: Array<{ __typename?: 'InputTemplate', id: string, name: string, type: InputDataType, description?: string | null, required: boolean }>, roles: { __typename?: 'Roles', request: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, respond: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, edit?: { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string } | null }, decisionSystem: { __typename?: 'AbsoluteDecision', threshold: number } | { __typename?: 'PercentageDecision', quorum: number, percentage: number } } };

export type ProcessSummaryPartsFragment = { __typename?: 'Process', id: string, currentProcessVersionId: string, name: string, description?: string | null, expirationSeconds: number, webhookUri?: string | null, createdAt: string, options: Array<{ __typename?: 'ProcessOption', id: string, value: string, type: OptionType }>, inputs: Array<{ __typename?: 'InputTemplate', id: string, name: string, type: InputDataType, description?: string | null, required: boolean }>, roles: { __typename?: 'Roles', request: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, respond: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, edit?: { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string } | null }, decisionSystem: { __typename?: 'AbsoluteDecision', threshold: number } | { __typename?: 'PercentageDecision', quorum: number, percentage: number } };

type AgentSummaryParts_Group_Fragment = { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } };

type AgentSummaryParts_User_Fragment = { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string };

export type AgentSummaryPartsFragment = AgentSummaryParts_Group_Fragment | AgentSummaryParts_User_Fragment;

export type OptionSummaryPartsFragment = { __typename?: 'ProcessOption', id: string, value: string, type: OptionType };

export type InputTemplateSummaryPartsFragment = { __typename?: 'InputTemplate', id: string, name: string, type: InputDataType, description?: string | null, required: boolean };

export type RoleSummaryPartsFragment = { __typename?: 'Roles', request: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, respond: Array<{ __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string }>, edit?: { __typename?: 'Group', id: string, name: string, icon?: string | null, memberCount: number, color?: string | null, createdAt: string, creator: { __typename?: 'User', id: string, name: string }, organization: { __typename?: 'Organization', name: string, icon: string }, discordRoleGroup: { __typename?: 'DiscordRoleGroup', id: string, name: string, color?: number | null, icon?: string | null, discordRoleId: string, discordServer: { __typename?: 'OnboardedDiscordServer', id: string, discordServerId: string, name: string, icon?: string | null } } } | { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string } | null };

export type AbsoluteDecisionSummaryPartsFragment = { __typename?: 'AbsoluteDecision', threshold: number };

export type PercentageDecisionSummaryPartsFragment = { __typename?: 'PercentageDecision', quorum: number, percentage: number };

type DecisionTypesSummaryParts_AbsoluteDecision_Fragment = { __typename?: 'AbsoluteDecision', threshold: number };

type DecisionTypesSummaryParts_PercentageDecision_Fragment = { __typename?: 'PercentageDecision', quorum: number, percentage: number };

export type DecisionTypesSummaryPartsFragment = DecisionTypesSummaryParts_AbsoluteDecision_Fragment | DecisionTypesSummaryParts_PercentageDecision_Fragment;

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id: string, name?: string | null, discordData: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } } | null };

export type MePartsFragment = { __typename?: 'Me', id: string, name?: string | null, discordData: { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string } };

export type UserPartsFragment = { __typename?: 'User', id: string, name: string, icon?: string | null, createdAt: string };

export type DiscordDataPartsFragment = { __typename?: 'DiscordData', id: string, username: string, discordId: string, discriminator?: string | null, avatar: string };

export const DiscordServerPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServerPartsFragment, unknown>;
export const DiscordServerRolePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"botRole"}}]}}]} as unknown as DocumentNode<DiscordServerRolePartsFragment, unknown>;
export const OptionSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessOption"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<OptionSummaryPartsFragment, unknown>;
export const InputTemplateSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InputTemplateSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InputTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}}]} as unknown as DocumentNode<InputTemplateSummaryPartsFragment, unknown>;
export const OrganizationPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<OrganizationPartsFragment, unknown>;
export const OnboardedDiscordServerPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<OnboardedDiscordServerPartsFragment, unknown>;
export const DiscordRoleGroupPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<DiscordRoleGroupPartsFragment, unknown>;
export const GroupSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}}]} as unknown as DocumentNode<GroupSummaryPartsFragment, unknown>;
export const UserPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UserPartsFragment, unknown>;
export const AgentSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgentSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AgentSummaryPartsFragment, unknown>;
export const RoleSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"respond"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgentSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}}]} as unknown as DocumentNode<RoleSummaryPartsFragment, unknown>;
export const DecisionTypesSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionTypesSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DecisionTypes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PercentageDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<DecisionTypesSummaryPartsFragment, unknown>;
export const ProcessSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProcessSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Process"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentProcessVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"expirationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUri"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InputTemplateSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DecisionTypesSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgentSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessOption"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InputTemplateSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InputTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"respond"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionTypesSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DecisionTypes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PercentageDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<ProcessSummaryPartsFragment, unknown>;
export const AbsoluteDecisionSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AbsoluteDecisionSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}}]} as unknown as DocumentNode<AbsoluteDecisionSummaryPartsFragment, unknown>;
export const PercentageDecisionSummaryPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PercentageDecisionSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PercentageDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]} as unknown as DocumentNode<PercentageDecisionSummaryPartsFragment, unknown>;
export const DiscordDataPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<DiscordDataPartsFragment, unknown>;
export const MePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Me"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<MePartsFragment, unknown>;
export const DiscordServersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DiscordServersQuery, DiscordServersQueryVariables>;
export const DiscordServerRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiscordServerRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordServerRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordServerRoleParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordServerRoleParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordAPIServerRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"botRole"}}]}}]} as unknown as DocumentNode<DiscordServerRolesQuery, DiscordServerRolesQueryVariables>;
export const SetUpDiscordServerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUpDiscordServerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"setUpDiscordServerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setUpDiscordServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetUpDiscordServerGroupMutation, SetUpDiscordServerGroupMutationVariables>;
export const GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Group"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}}]} as unknown as DocumentNode<GroupQuery, GroupQueryVariables>;
export const GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupsForCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}}]} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const NewProcessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewProcess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"process"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"newProcessArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newProcess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"process"},"value":{"kind":"Variable","name":{"kind":"Name","value":"process"}}}]}]}}]} as unknown as DocumentNode<NewProcessMutation, NewProcessMutationVariables>;
export const ProcessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Process"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"process"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"processId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProcessSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessOption"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InputTemplateSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InputTemplate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OnboardedDiscordServerParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OnboardedDiscordServer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discordServerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordRoleGroupParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordRoleGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OnboardedDiscordServerParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discordRoleGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordRoleGroupParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgentSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Group"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupSummaryParts"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"respond"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgentSummaryParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionTypesSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DecisionTypes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PercentageDecision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quorum"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProcessSummaryParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Process"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentProcessVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"expirationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"webhookUri"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InputTemplateSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DecisionTypesSummaryParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ProcessQuery, ProcessQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiscordDataParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discriminator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Me"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiscordDataParts"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Agent": [
      "Group",
      "User"
    ],
    "DecisionTypes": [
      "AbsoluteDecision",
      "PercentageDecision"
    ]
  }
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

export type AbsoluteDecision = {
  __typename?: 'AbsoluteDecision';
  threshold: Scalars['Int']['output'];
};

export type AbsoluteDecisionArgs = {
  threshold: Scalars['Int']['input'];
};

export type Agent = Group | User;

export enum AgentType {
  Group = 'Group',
  User = 'User'
}

export type DecisionTypes = AbsoluteDecision | PercentageDecision;

export type DiscordApiServer = {
  __typename?: 'DiscordAPIServer';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DiscordApiServerRole = {
  __typename?: 'DiscordAPIServerRole';
  botRole: Scalars['Boolean']['output'];
  color: Scalars['Int']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
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
  color?: Maybe<Scalars['Int']['output']>;
  discordRoleId: Scalars['String']['output'];
  discordServer: OnboardedDiscordServer;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  creator: User;
  discordRoleGroup: DiscordRoleGroup;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
};

export enum InputDataType {
  Float = 'Float',
  Int = 'Int',
  Text = 'Text',
  Uri = 'Uri'
}

export type InputTemplate = {
  __typename?: 'InputTemplate';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: InputDataType;
};

export type InputTemplateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  type: InputDataType;
};

export type LogOutResponse = {
  __typename?: 'LogOutResponse';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Me = {
  __typename?: 'Me';
  discordData: DiscordData;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  logOut?: Maybe<LogOutResponse>;
  newProcess: Scalars['String']['output'];
  setUpDiscordServer: Group;
};


export type MutationNewProcessArgs = {
  process: NewProcessArgs;
};


export type MutationSetUpDiscordServerArgs = {
  input: SetUpDiscordServerInput;
};

export type OnboardedDiscordServer = {
  __typename?: 'OnboardedDiscordServer';
  banner?: Maybe<Scalars['String']['output']>;
  discordServerId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum OptionType {
  Float = 'Float',
  Int = 'Int',
  Text = 'Text',
  Uri = 'Uri'
}

export type Organization = {
  __typename?: 'Organization';
  icon: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PercentageDecision = {
  __typename?: 'PercentageDecision';
  percentage: Scalars['Float']['output'];
  quorum: Scalars['Int']['output'];
};

export type PercentageDecisionArgs = {
  percentage: Scalars['Float']['input'];
  quorum: Scalars['Int']['input'];
};

export type Process = {
  __typename?: 'Process';
  createdAt: Scalars['String']['output'];
  creator: User;
  currentProcessVersionId: Scalars['String']['output'];
  decisionSystem: DecisionTypes;
  description?: Maybe<Scalars['String']['output']>;
  expirationSeconds: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  inputs: Array<InputTemplate>;
  name: Scalars['String']['output'];
  options: Array<ProcessOption>;
  roles: Roles;
  webhookUri?: Maybe<Scalars['String']['output']>;
};

export type ProcessOption = {
  __typename?: 'ProcessOption';
  id: Scalars['String']['output'];
  type: OptionType;
  value: Scalars['String']['output'];
};

export type ProcessOptionArgs = {
  type: OptionType;
  value: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  discordServers: Array<DiscordApiServer>;
  group: Group;
  groupsForCurrentUser: Array<Group>;
  me?: Maybe<Me>;
  process: Process;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};


export type QueryProcessArgs = {
  processId: Scalars['String']['input'];
};

export type RoleArgs = {
  agentType: AgentType;
  id: Scalars['String']['input'];
  type: RoleType;
};

export enum RoleType {
  Request = 'Request',
  Respond = 'Respond'
}

export type Roles = {
  __typename?: 'Roles';
  edit?: Maybe<Agent>;
  request: Array<Agent>;
  respond: Array<Agent>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  discordData: DiscordData;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type NewProcessArgs = {
  absoluteDecision?: InputMaybe<AbsoluteDecisionArgs>;
  description?: InputMaybe<Scalars['String']['input']>;
  editProcessId?: InputMaybe<Scalars['String']['input']>;
  expirationSeconds: Scalars['Int']['input'];
  inputs: Array<InputTemplateArgs>;
  name: Scalars['String']['input'];
  options: Array<ProcessOptionArgs>;
  percentageDecision?: InputMaybe<PercentageDecisionArgs>;
  roles: Array<RoleArgs>;
  webhookUri?: InputMaybe<Scalars['String']['input']>;
};

export type SetUpDiscordServerInput = {
  roleId?: InputMaybe<Scalars['String']['input']>;
  serverId: Scalars['String']['input'];
};
