import { GraphQLResolveInfo } from 'graphql';
import { GraphqlRequestContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Action = CallWebhook | EvolveFlow | EvolveGroup | GroupWatchFlow | TriggerStep;

export type ActionArgs = {
  callWebhook?: InputMaybe<CallWebhookArgs>;
  filter?: InputMaybe<ActionFilterArgs>;
  locked: Scalars['Boolean']['input'];
  stepId?: InputMaybe<Scalars['String']['input']>;
  type: ActionType;
};

export type ActionExecution = {
  __typename?: 'ActionExecution';
  actionId: Scalars['String']['output'];
  lastAttemptedAt?: Maybe<Scalars['String']['output']>;
  status: ActionStatus;
};

export type ActionFilter = {
  __typename?: 'ActionFilter';
  option: Option;
  resultConfigId: Scalars['String']['output'];
  resultName: Scalars['String']['output'];
};

export type ActionFilterArgs = {
  optionId: Scalars['String']['input'];
  resultConfigId: Scalars['String']['input'];
};

export enum ActionStatus {
  Attempting = 'Attempting',
  Complete = 'Complete',
  DidNotPassFilter = 'DidNotPassFilter',
  Error = 'Error',
  NotStarted = 'NotStarted'
}

export enum ActionType {
  CallWebhook = 'CallWebhook',
  EvolveFlow = 'EvolveFlow',
  EvolveGroup = 'EvolveGroup',
  GroupWatchFlow = 'GroupWatchFlow',
  TriggerStep = 'TriggerStep'
}

export type AlchemyApiNftContract = {
  __typename?: 'AlchemyApiNftContract';
  address: Scalars['String']['output'];
  chain: Blockchain;
  icon?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type: NftTypes;
};

export type AlchemyApiNftToken = {
  __typename?: 'AlchemyApiNftToken';
  chain: Blockchain;
  contract: AlchemyApiNftContract;
  icon?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
};

export type ApiHatToken = {
  __typename?: 'ApiHatToken';
  chain: Blockchain;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  readableTokenId: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  topHatIcon?: Maybe<Scalars['String']['output']>;
  topHatName?: Maybe<Scalars['String']['output']>;
};

export enum Blockchain {
  Arbitrum = 'Arbitrum',
  Base = 'Base',
  Ethereum = 'Ethereum',
  Matic = 'Matic',
  Optimism = 'Optimism'
}

export type CallWebhook = {
  __typename?: 'CallWebhook';
  filter?: Maybe<ActionFilter>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uri: Scalars['String']['output'];
  webhookId: Scalars['String']['output'];
  webhookName: Scalars['String']['output'];
};

export type CallWebhookArgs = {
  name: Scalars['String']['input'];
  originalUri?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['String']['input'];
  webhookId?: InputMaybe<Scalars['String']['input']>;
};

export type CustomGroupArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  entityId: Scalars['String']['input'];
  flows: GroupFlowArgs;
  members: Array<EntityArgs>;
  name: Scalars['String']['input'];
  notificationEntity?: InputMaybe<EntityArgs>;
};

export type DateTimeValue = {
  __typename?: 'DateTimeValue';
  dateTime: Scalars['String']['output'];
};

export type DateValue = {
  __typename?: 'DateValue';
  date: Scalars['String']['output'];
};

export type Decision = {
  __typename?: 'Decision';
  criteria?: Maybe<Scalars['String']['output']>;
  decisionType: DecisionType;
  defaultOption?: Maybe<Option>;
  field: Field;
  name: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
  threshold?: Maybe<Scalars['Int']['output']>;
};

export type DecisionArgs = {
  criteria?: InputMaybe<Scalars['String']['input']>;
  defaultOptionId?: InputMaybe<Scalars['String']['input']>;
  threshold?: InputMaybe<Scalars['Int']['input']>;
  type: DecisionType;
};

export enum DecisionType {
  Ai = 'Ai',
  NumberThreshold = 'NumberThreshold',
  PercentageThreshold = 'PercentageThreshold',
  WeightedAverage = 'WeightedAverage'
}

export type DiscordApiServerRole = {
  __typename?: 'DiscordAPIServerRole';
  botRole: Scalars['Boolean']['output'];
  color: Scalars['Int']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
};

export type DiscordRoleGroup = {
  __typename?: 'DiscordRoleGroup';
  color?: Maybe<Scalars['Int']['output']>;
  discordRoleId?: Maybe<Scalars['String']['output']>;
  discordServer: OnboardedDiscordServer;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  unicodeEmoji?: Maybe<Scalars['String']['output']>;
};

export type DiscordServer = {
  __typename?: 'DiscordServer';
  hasCultsBot: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EntitiesValue = {
  __typename?: 'EntitiesValue';
  entities: Array<Entity>;
};

export type Entity = Group | Identity | User;

export type EntityArgs = {
  id: Scalars['String']['input'];
};

export enum EntityType {
  Group = 'Group',
  Identity = 'Identity',
  User = 'User'
}

export type EvolveFlow = {
  __typename?: 'EvolveFlow';
  filter?: Maybe<ActionFilter>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type EvolveGroup = {
  __typename?: 'EvolveGroup';
  filter?: Maybe<ActionFilter>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type Field = {
  __typename?: 'Field';
  defaultAnswer?: Maybe<Value>;
  fieldId: Scalars['String']['output'];
  isInternal: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  optionsConfig?: Maybe<OptionsConfig>;
  required: Scalars['Boolean']['output'];
  systemType?: Maybe<SystemFieldType>;
  type: ValueType;
};

export type FieldAnswerArgs = {
  fieldId: Scalars['String']['input'];
  optionSelections?: InputMaybe<Array<OptionSelectionArgs>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type FieldArgs = {
  fieldId: Scalars['String']['input'];
  isInternal: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  optionsConfig?: InputMaybe<FieldOptionsConfigArgs>;
  required: Scalars['Boolean']['input'];
  systemType?: InputMaybe<SystemFieldType>;
  type: ValueType;
};

export type FieldOptionsConfigArgs = {
  linkedResultOptions: Array<Scalars['String']['input']>;
  maxSelections?: InputMaybe<Scalars['Int']['input']>;
  options: Array<OptionArgs>;
  selectionType: OptionSelectionType;
  triggerOptionsType?: InputMaybe<ValueType>;
};

export type FieldSet = {
  __typename?: 'FieldSet';
  fields: Array<Field>;
  locked: Scalars['Boolean']['output'];
};

export type FieldSetArgs = {
  fields: Array<FieldArgs>;
  locked: Scalars['Boolean']['input'];
};

export type FloatValue = {
  __typename?: 'FloatValue';
  float: Scalars['Float']['output'];
};

export type Flow = {
  __typename?: 'Flow';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  currentFlowVersionId?: Maybe<Scalars['String']['output']>;
  evolve?: Maybe<Flow>;
  fieldSet: FieldSet;
  flowId: Scalars['String']['output'];
  flowVersionId: Scalars['String']['output'];
  flowsEvolvedByThisFlow: Array<FlowReference>;
  group?: Maybe<Group>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reusable: Scalars['Boolean']['output'];
  steps: Array<Step>;
  trigger: TriggerConfig;
  type: FlowType;
  versionCreatedAt: Scalars['String']['output'];
  versionPublishedAt?: Maybe<Scalars['String']['output']>;
  watching: FlowWatchers;
};

export type FlowReference = {
  __typename?: 'FlowReference';
  flowId: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
  flowVersionId: Scalars['String']['output'];
};

export type FlowSummary = {
  __typename?: 'FlowSummary';
  createdAt: Scalars['String']['output'];
  creator: Entity;
  flowId: Scalars['String']['output'];
  group?: Maybe<Group>;
  name: Scalars['String']['output'];
  trigger: TriggerConfig;
  watching: FlowWatchers;
};

export enum FlowType {
  Custom = 'Custom',
  Evolve = 'Evolve',
  EvolveGroup = 'EvolveGroup',
  GroupWatchFlow = 'GroupWatchFlow'
}

export type FlowVersionValue = {
  __typename?: 'FlowVersionValue';
  flowVersion: FlowReference;
};

export type FlowWatchers = {
  __typename?: 'FlowWatchers';
  groups: Array<Group>;
  user: Scalars['Boolean']['output'];
};

export type FlowsValue = {
  __typename?: 'FlowsValue';
  flows: Array<FlowReference>;
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  groupType: GroupType;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isMember: Scalars['Boolean']['output'];
  isWatched: Scalars['Boolean']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  organization?: Maybe<Organization>;
};

export type GroupDiscordRoleArgs = {
  roleId: Scalars['String']['input'];
  serverId: Scalars['String']['input'];
};

export type GroupEnsArgs = {
  name: Scalars['String']['input'];
};

export type GroupFlowArgs = {
  evolveGroup: GroupFlowPolicyArgs;
  watch: GroupFlowPolicyArgs;
};

export type GroupFlowPolicyArgs = {
  decision?: InputMaybe<DecisionArgs>;
  type: GroupFlowPolicyType;
};

export enum GroupFlowPolicyType {
  CreatorAutoApprove = 'CreatorAutoApprove',
  GroupAutoApprove = 'GroupAutoApprove',
  GroupDecision = 'GroupDecision'
}

export type GroupHatArgs = {
  chain: Blockchain;
  tokenId: Scalars['String']['input'];
};

export type GroupIze = {
  __typename?: 'GroupIze';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GroupNft = {
  __typename?: 'GroupNft';
  NftCollection: NftCollection;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
};

export type GroupNftArgs = {
  address: Scalars['String']['input'];
  chain: Blockchain;
  tokenId?: InputMaybe<Scalars['String']['input']>;
};

export type GroupTelegramChat = {
  __typename?: 'GroupTelegramChat';
  chatId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  messageThreadId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type GroupType = DiscordRoleGroup | GroupIze | GroupNft | GroupTelegramChat;

export type GroupWatchFlow = {
  __typename?: 'GroupWatchFlow';
  filter?: Maybe<ActionFilter>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type Identity = {
  __typename?: 'Identity';
  entityId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identityType: IdentityType;
  name: Scalars['String']['output'];
};

export type IdentityBlockchain = {
  __typename?: 'IdentityBlockchain';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type IdentityBlockchainArgs = {
  address: Scalars['String']['input'];
};

export type IdentityDiscord = {
  __typename?: 'IdentityDiscord';
  id: Scalars['String']['output'];
};

export type IdentityDiscordArgs = {
  discordUserId: Scalars['String']['input'];
};

export type IdentityEmail = {
  __typename?: 'IdentityEmail';
  id: Scalars['String']['output'];
};

export type IdentityEmailArgs = {
  email: Scalars['String']['input'];
};

export type IdentityTelegram = {
  __typename?: 'IdentityTelegram';
  id: Scalars['String']['output'];
};

export type IdentityType = IdentityBlockchain | IdentityDiscord | IdentityEmail | IdentityTelegram;

export type IzeGroup = {
  __typename?: 'IzeGroup';
  description?: Maybe<Scalars['String']['output']>;
  evolveGroupFlowId?: Maybe<Scalars['String']['output']>;
  group: Group;
  members: Array<Entity>;
  notificationEntity?: Maybe<Entity>;
};

export type LinkedResult = {
  __typename?: 'LinkedResult';
  fieldId: Scalars['String']['output'];
  fieldName: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
  resultName: Scalars['String']['output'];
};

export type LlmSummary = {
  __typename?: 'LlmSummary';
  field: Field;
  isList: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  prompt: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
};

export type LlmSummaryArgs = {
  isList: Scalars['Boolean']['input'];
  prompt: Scalars['String']['input'];
};

export type Me = {
  __typename?: 'Me';
  groups: Array<Group>;
  identities: Array<Identity>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  endRequestStep: Scalars['Boolean']['output'];
  newCustomGroup: Scalars['String']['output'];
  newEntities: Array<Entity>;
  newEvolveRequest: Scalars['String']['output'];
  newFlow: Scalars['String']['output'];
  newRequest: Scalars['String']['output'];
  newResponse: Scalars['String']['output'];
  testWebhook: Scalars['Boolean']['output'];
  updateProfile: Scalars['Boolean']['output'];
  watchFlow: Scalars['Boolean']['output'];
  watchGroup: Scalars['Boolean']['output'];
};


export type MutationEndRequestStepArgs = {
  requestStepId: Scalars['String']['input'];
};


export type MutationNewCustomGroupArgs = {
  inputs: CustomGroupArgs;
};


export type MutationNewEntitiesArgs = {
  entities: Array<NewEntityArgs>;
};


export type MutationNewEvolveRequestArgs = {
  request: NewEvolveRequestArgs;
};


export type MutationNewFlowArgs = {
  new: NewFlowWithEvolveArgs;
};


export type MutationNewRequestArgs = {
  request: NewRequestArgs;
};


export type MutationNewResponseArgs = {
  response: NewResponseArgs;
};


export type MutationTestWebhookArgs = {
  inputs: TestWebhookArgs;
};


export type MutationUpdateProfileArgs = {
  profile: UpdateProfileArgs;
};


export type MutationWatchFlowArgs = {
  flowId: Scalars['String']['input'];
  watch: Scalars['Boolean']['input'];
};


export type MutationWatchGroupArgs = {
  groupId: Scalars['String']['input'];
  watch: Scalars['Boolean']['input'];
};

export type NewEntityArgs = {
  groupDiscordRole?: InputMaybe<GroupDiscordRoleArgs>;
  groupEns?: InputMaybe<GroupEnsArgs>;
  groupHat?: InputMaybe<GroupHatArgs>;
  groupNft?: InputMaybe<GroupNftArgs>;
  identityBlockchain?: InputMaybe<IdentityBlockchainArgs>;
  identityDiscord?: InputMaybe<IdentityDiscordArgs>;
  identityEmail?: InputMaybe<IdentityEmailArgs>;
};

export enum NewEntityTypes {
  GroupDiscord = 'GroupDiscord',
  GroupHat = 'GroupHat',
  GroupNft = 'GroupNft',
  GroupTelegramChat = 'GroupTelegramChat',
  IdentityBlockchain = 'IdentityBlockchain',
  IdentityDiscord = 'IdentityDiscord',
  IdentityEmail = 'IdentityEmail'
}

export type NewEvolveRequestArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  flowId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  new: NewFlowWithEvolveArgs;
};

export type NewFlowArgs = {
  fieldSet: FieldSetArgs;
  flowVersionId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requestName?: InputMaybe<Scalars['String']['input']>;
  steps: Array<NewStepArgs>;
  trigger: TriggerConfigArgs;
  type: FlowType;
};

export type NewFlowWithEvolveArgs = {
  evolve?: InputMaybe<NewFlowArgs>;
  flow: NewFlowArgs;
  reusable: Scalars['Boolean']['input'];
};

export type NewRequestArgs = {
  flowId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requestDefinedOptions: Array<RequestDefinedOptionsArgs>;
  requestFields: Array<FieldAnswerArgs>;
  requestId: Scalars['String']['input'];
};

export type NewResponseArgs = {
  answers: Array<FieldAnswerArgs>;
  requestStepId: Scalars['String']['input'];
  responseId: Scalars['String']['input'];
};

export type NewStepArgs = {
  action?: InputMaybe<ActionArgs>;
  fieldSet: FieldSetArgs;
  response?: InputMaybe<ResponseConfigArgs>;
  result: Array<ResultArgs>;
  stepId: Scalars['String']['input'];
};

export type NftCollection = {
  __typename?: 'NftCollection';
  address: Scalars['String']['output'];
  chain: Blockchain;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type: NftTypes;
};

export enum NftTypes {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type OnboardedDiscordServer = {
  __typename?: 'OnboardedDiscordServer';
  banner?: Maybe<Scalars['String']['output']>;
  discordServerId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Option = {
  __typename?: 'Option';
  optionId: Scalars['String']['output'];
  value: Value;
};

export type OptionArgs = {
  optionId: Scalars['String']['input'];
  type: ValueType;
  value: Scalars['String']['input'];
};

export type OptionSelection = {
  __typename?: 'OptionSelection';
  optionId: Scalars['String']['output'];
  value: Value;
  weight: Scalars['Int']['output'];
};

export type OptionSelectionArgs = {
  optionId?: InputMaybe<Scalars['String']['input']>;
  optionIndex?: InputMaybe<Scalars['Int']['input']>;
  weight: Scalars['Float']['input'];
};

export enum OptionSelectionType {
  None = 'None',
  Rank = 'Rank',
  Select = 'Select'
}

export type OptionSelectionsValue = {
  __typename?: 'OptionSelectionsValue';
  selections: Array<OptionSelection>;
};

export type OptionValue = DateTimeValue | DateValue | EntitiesValue | FloatValue | FlowVersionValue | FlowsValue | StringValue | UriValue;

export type OptionsConfig = {
  __typename?: 'OptionsConfig';
  linkedResultOptions: Array<LinkedResult>;
  maxSelections?: Maybe<Scalars['Int']['output']>;
  options: Array<Option>;
  selectionType: OptionSelectionType;
  systemType?: Maybe<SystemFieldType>;
  triggerOptionsType?: Maybe<ValueType>;
};

export type Organization = {
  __typename?: 'Organization';
  icon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  anyone: Scalars['Boolean']['output'];
  entities: Array<Entity>;
};

export type PermissionArgs = {
  anyone: Scalars['Boolean']['input'];
  entities: Array<EntityArgs>;
};

export type PrioritizationArgs = {
  numPrioritizedItems?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  getDiscordServers: Array<DiscordServer>;
  getFlow: Flow;
  getFlows: Array<FlowSummary>;
  getRequest: Request;
  getRequests: Array<RequestSummary>;
  group: IzeGroup;
  groupsForCurrentUser: Array<Group>;
  hatToken?: Maybe<ApiHatToken>;
  me?: Maybe<Me>;
  nftContract?: Maybe<AlchemyApiNftContract>;
  nftToken?: Maybe<AlchemyApiNftToken>;
  searchNftContracts: Array<AlchemyApiNftContract>;
  telegramChats: Array<Entity>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGetFlowArgs = {
  flowId?: InputMaybe<Scalars['String']['input']>;
  flowVersionId?: InputMaybe<Scalars['String']['input']>;
  isForEvolveRequest?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetFlowsArgs = {
  createdByUser: Scalars['Boolean']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  excludeGroupId?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['String']['input']>;
  hasTriggerPermissions: Scalars['Boolean']['input'];
  limit: Scalars['Int']['input'];
  searchQuery: Scalars['String']['input'];
  watchedByUser: Scalars['Boolean']['input'];
  watchedByUserGroups: Scalars['Boolean']['input'];
};


export type QueryGetRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryGetRequestsArgs = {
  createdByUser: Scalars['Boolean']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  flowId?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['String']['input']>;
  hasRespondPermission: Scalars['Boolean']['input'];
  limit: Scalars['Int']['input'];
  open: Scalars['Boolean']['input'];
  searchQuery: Scalars['String']['input'];
  watchedByUser: Scalars['Boolean']['input'];
  watchedByUserGroups: Scalars['Boolean']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
};


export type QueryGroupsForCurrentUserArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  searchQuery: Scalars['String']['input'];
  watchFilter: WatchFilter;
};


export type QueryHatTokenArgs = {
  chain: Blockchain;
  tokenId: Scalars['String']['input'];
};


export type QueryNftContractArgs = {
  address: Scalars['String']['input'];
  chain: Blockchain;
};


export type QueryNftTokenArgs = {
  address: Scalars['String']['input'];
  chain: Blockchain;
  tokenId: Scalars['String']['input'];
};


export type QuerySearchNftContractsArgs = {
  chain: Blockchain;
  query: Scalars['String']['input'];
};


export type QueryTelegramChatsArgs = {
  adminOnly: Scalars['Boolean']['input'];
};

export type Ranking = {
  __typename?: 'Ranking';
  field: Field;
  name: Scalars['String']['output'];
  numOptionsToInclude?: Maybe<Scalars['Int']['output']>;
  resultConfigId: Scalars['String']['output'];
};

export type RawAnswers = {
  __typename?: 'RawAnswers';
  field: Field;
  name: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
};

export type Request = {
  __typename?: 'Request';
  createdAt: Scalars['String']['output'];
  creator: Entity;
  currentStepIndex: Scalars['Int']['output'];
  final: Scalars['Boolean']['output'];
  flow: Flow;
  name: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  requestSteps: Array<RequestStep>;
  triggerDefinedOptions: Array<TriggerDefinedOptions>;
  triggerFieldAnswers: Array<TriggerFieldAnswer>;
};

export type RequestDefinedOptionsArgs = {
  fieldId: Scalars['String']['input'];
  options: Array<OptionArgs>;
};

export type RequestStep = {
  __typename?: 'RequestStep';
  actionExecution?: Maybe<ActionExecution>;
  answers: Array<ResponseFieldAnswers>;
  createdAt: Scalars['String']['output'];
  expirationDate: Scalars['String']['output'];
  fieldSet: FieldSet;
  requestStepId: Scalars['String']['output'];
  results: Array<ResultGroup>;
  status: RequestStepStatuses;
  stepId: Scalars['String']['output'];
  userResponded: Scalars['Boolean']['output'];
};

export type RequestStepActionSummary = {
  __typename?: 'RequestStepActionSummary';
  name: Scalars['String']['output'];
  status: ActionStatus;
};

export enum RequestStepRespondPermissionFilter {
  All = 'All',
  NoRespondPermission = 'NoRespondPermission',
  RespondPermission = 'RespondPermission'
}

export enum RequestStepStatus {
  CollectingResponses = 'CollectingResponses',
  Complete = 'Complete',
  CreatingResult = 'CreatingResult',
  Error = 'Error',
  ExecutingAction = 'ExecutingAction',
  NotStarted = 'NotStarted'
}

export enum RequestStepStatusFilter {
  All = 'All',
  Closed = 'Closed',
  Open = 'Open'
}

export type RequestStepStatuses = {
  __typename?: 'RequestStepStatuses';
  actionsFinal: Scalars['Boolean']['output'];
  final: Scalars['Boolean']['output'];
  responseFinal: Scalars['Boolean']['output'];
  resultsFinal: Scalars['Boolean']['output'];
  status: RequestStepStatus;
};

export type RequestStepSummary = {
  __typename?: 'RequestStepSummary';
  action?: Maybe<RequestStepActionSummary>;
  expirationDate: Scalars['String']['output'];
  fieldName: Scalars['String']['output'];
  requestStepId: Scalars['String']['output'];
  respondPermission?: Maybe<Permission>;
  result?: Maybe<ResultGroup>;
  resultName: Scalars['String']['output'];
  status: RequestStepStatuses;
  userRespondPermission: Scalars['Boolean']['output'];
  userResponded: Scalars['Boolean']['output'];
};

export type RequestSummary = {
  __typename?: 'RequestSummary';
  createdAt: Scalars['String']['output'];
  creator: Entity;
  currentStep: RequestStepSummary;
  flowId: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  requestName: Scalars['String']['output'];
  status: Scalars['Boolean']['output'];
};

export type ResponseConfig = {
  __typename?: 'ResponseConfig';
  allowMultipleResponses: Scalars['Boolean']['output'];
  canBeManuallyEnded: Scalars['Boolean']['output'];
  expirationSeconds: Scalars['Int']['output'];
  minResponses: Scalars['Int']['output'];
  permission: Permission;
  userPermission: Scalars['Boolean']['output'];
};

export type ResponseConfigArgs = {
  allowMultipleResponses: Scalars['Boolean']['input'];
  canBeManuallyEnded: Scalars['Boolean']['input'];
  expirationSeconds: Scalars['Int']['input'];
  minResponses: Scalars['Int']['input'];
  permission: PermissionArgs;
};

export type ResponseFieldAnswers = {
  __typename?: 'ResponseFieldAnswers';
  answers: Array<UserFieldAnswer>;
  field: Field;
  summary: ResponseFieldAnswersSummary;
};

export type ResponseFieldAnswersOptionsSummary = {
  __typename?: 'ResponseFieldAnswersOptionsSummary';
  count: Scalars['Int']['output'];
  optionId: Scalars['String']['output'];
  rank?: Maybe<Scalars['Float']['output']>;
};

export type ResponseFieldAnswersSummary = {
  __typename?: 'ResponseFieldAnswersSummary';
  count: Scalars['Int']['output'];
  options?: Maybe<Array<ResponseFieldAnswersOptionsSummary>>;
};

export type Result = {
  __typename?: 'Result';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  resultItems: Array<ResultItem>;
  type: ResultType;
};

export type ResultArgs = {
  decision?: InputMaybe<DecisionArgs>;
  fieldId: Scalars['String']['input'];
  llmSummary?: InputMaybe<LlmSummaryArgs>;
  prioritization?: InputMaybe<PrioritizationArgs>;
  resultConfigId: Scalars['String']['input'];
  type: ResultType;
};

export type ResultConfig = Decision | LlmSummary | Ranking | RawAnswers;

export type ResultGroup = {
  __typename?: 'ResultGroup';
  complete: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
  results: Array<Result>;
  status: ResultGroupStatus;
};

export enum ResultGroupStatus {
  Attempting = 'Attempting',
  Error = 'Error',
  FinalNoResult = 'FinalNoResult',
  FinalResult = 'FinalResult',
  NotStarted = 'NotStarted',
  Preliminary = 'Preliminary'
}

export type ResultItem = {
  __typename?: 'ResultItem';
  id: Scalars['String']['output'];
  optionId?: Maybe<Scalars['String']['output']>;
  value: Value;
};

export enum ResultType {
  Decision = 'Decision',
  LlmSummary = 'LlmSummary',
  Ranking = 'Ranking',
  RawAnswers = 'RawAnswers'
}

export enum Status {
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  Failure = 'Failure',
  InProgress = 'InProgress',
  NotAttempted = 'NotAttempted'
}

export type Step = {
  __typename?: 'Step';
  action?: Maybe<Action>;
  fieldSet: FieldSet;
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  response?: Maybe<ResponseConfig>;
  result: Array<ResultConfig>;
};

export type StringValue = {
  __typename?: 'StringValue';
  value: Scalars['String']['output'];
};

export enum SystemFieldType {
  EvolveFlowCurrent = 'EvolveFlowCurrent',
  EvolveFlowDescription = 'EvolveFlowDescription',
  EvolveFlowProposed = 'EvolveFlowProposed',
  GroupDescription = 'GroupDescription',
  GroupMembers = 'GroupMembers',
  GroupName = 'GroupName',
  UnwatchFlow = 'UnwatchFlow',
  WatchFlow = 'WatchFlow'
}

export type TestWebhookArgs = {
  flowName: Scalars['String']['input'];
  results: Array<ResultType>;
  triggerFields: Array<TestWebhookTriggerFieldsArgs>;
  uri: Scalars['String']['input'];
};

export type TestWebhookTriggerFieldsArgs = {
  name: Scalars['String']['input'];
  type: ValueType;
};

export type TriggerConfig = {
  __typename?: 'TriggerConfig';
  permission: Permission;
  userPermission: Scalars['Boolean']['output'];
};

export type TriggerConfigArgs = {
  permission: PermissionArgs;
};

export type TriggerContext = {
  __typename?: 'TriggerContext';
  answers: Array<TriggerFieldAnswer>;
  options: Array<TriggerDefinedOptions>;
};

export type TriggerDefinedOptions = {
  __typename?: 'TriggerDefinedOptions';
  fieldId: Scalars['String']['output'];
  fieldName: Scalars['String']['output'];
  options: Array<Option>;
};

export type TriggerFieldAnswer = {
  __typename?: 'TriggerFieldAnswer';
  answer: Value;
  field: Field;
};

export type TriggerStep = {
  __typename?: 'TriggerStep';
  filter?: Maybe<ActionFilter>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  stepId: Scalars['String']['output'];
};

export type UpdateProfileArgs = {
  name: Scalars['String']['input'];
};

export type UriValue = {
  __typename?: 'UriValue';
  uri: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UserFieldAnswer = {
  __typename?: 'UserFieldAnswer';
  answer: Value;
  createdAt: Scalars['String']['output'];
  creator: Entity;
};

export type Value = DateTimeValue | DateValue | EntitiesValue | FloatValue | FlowVersionValue | FlowsValue | OptionSelectionsValue | StringValue | UriValue;

export enum ValueType {
  Date = 'Date',
  DateTime = 'DateTime',
  Entities = 'Entities',
  Float = 'Float',
  FlowVersion = 'FlowVersion',
  Flows = 'Flows',
  OptionSelections = 'OptionSelections',
  String = 'String',
  Uri = 'Uri'
}

export enum WatchFilter {
  All = 'All',
  Unwatched = 'Unwatched',
  Watched = 'Watched'
}

export type SetUpDiscordServerInput = {
  roleId?: InputMaybe<Scalars['String']['input']>;
  serverId: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  Action: ( Omit<CallWebhook, 'filter'> & { filter?: Maybe<_RefType['ActionFilter']> } ) | ( Omit<EvolveFlow, 'filter'> & { filter?: Maybe<_RefType['ActionFilter']> } ) | ( Omit<EvolveGroup, 'filter'> & { filter?: Maybe<_RefType['ActionFilter']> } ) | ( Omit<GroupWatchFlow, 'filter'> & { filter?: Maybe<_RefType['ActionFilter']> } ) | ( Omit<TriggerStep, 'filter'> & { filter?: Maybe<_RefType['ActionFilter']> } );
  Entity: ( Omit<Group, 'groupType'> & { groupType: _RefType['GroupType'] } ) | ( Omit<Identity, 'identityType'> & { identityType: _RefType['IdentityType'] } ) | ( User );
  GroupType: ( DiscordRoleGroup ) | ( GroupIze ) | ( GroupNft ) | ( GroupTelegramChat );
  IdentityType: ( IdentityBlockchain ) | ( IdentityDiscord ) | ( IdentityEmail ) | ( IdentityTelegram );
  OptionValue: ( DateTimeValue ) | ( DateValue ) | ( Omit<EntitiesValue, 'entities'> & { entities: Array<_RefType['Entity']> } ) | ( FloatValue ) | ( FlowVersionValue ) | ( FlowsValue ) | ( StringValue ) | ( UriValue );
  ResultConfig: ( Omit<Decision, 'defaultOption' | 'field'> & { defaultOption?: Maybe<_RefType['Option']>, field: _RefType['Field'] } ) | ( Omit<LlmSummary, 'field'> & { field: _RefType['Field'] } ) | ( Omit<Ranking, 'field'> & { field: _RefType['Field'] } ) | ( Omit<RawAnswers, 'field'> & { field: _RefType['Field'] } );
  Value: ( DateTimeValue ) | ( DateValue ) | ( Omit<EntitiesValue, 'entities'> & { entities: Array<_RefType['Entity']> } ) | ( FloatValue ) | ( FlowVersionValue ) | ( FlowsValue ) | ( Omit<OptionSelectionsValue, 'selections'> & { selections: Array<_RefType['OptionSelection']> } ) | ( StringValue ) | ( UriValue );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Action: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Action']>;
  ActionArgs: ActionArgs;
  ActionExecution: ResolverTypeWrapper<ActionExecution>;
  ActionFilter: ResolverTypeWrapper<Omit<ActionFilter, 'option'> & { option: ResolversTypes['Option'] }>;
  ActionFilterArgs: ActionFilterArgs;
  ActionStatus: ActionStatus;
  ActionType: ActionType;
  AlchemyApiNftContract: ResolverTypeWrapper<AlchemyApiNftContract>;
  AlchemyApiNftToken: ResolverTypeWrapper<AlchemyApiNftToken>;
  ApiHatToken: ResolverTypeWrapper<ApiHatToken>;
  Blockchain: Blockchain;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CallWebhook: ResolverTypeWrapper<Omit<CallWebhook, 'filter'> & { filter?: Maybe<ResolversTypes['ActionFilter']> }>;
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  DateTimeValue: ResolverTypeWrapper<DateTimeValue>;
  DateValue: ResolverTypeWrapper<DateValue>;
  Decision: ResolverTypeWrapper<Omit<Decision, 'defaultOption' | 'field'> & { defaultOption?: Maybe<ResolversTypes['Option']>, field: ResolversTypes['Field'] }>;
  DecisionArgs: DecisionArgs;
  DecisionType: DecisionType;
  DiscordAPIServerRole: ResolverTypeWrapper<DiscordApiServerRole>;
  DiscordRoleGroup: ResolverTypeWrapper<DiscordRoleGroup>;
  DiscordServer: ResolverTypeWrapper<DiscordServer>;
  EntitiesValue: ResolverTypeWrapper<Omit<EntitiesValue, 'entities'> & { entities: Array<ResolversTypes['Entity']> }>;
  Entity: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Entity']>;
  EntityArgs: EntityArgs;
  EntityType: EntityType;
  EvolveFlow: ResolverTypeWrapper<Omit<EvolveFlow, 'filter'> & { filter?: Maybe<ResolversTypes['ActionFilter']> }>;
  EvolveGroup: ResolverTypeWrapper<Omit<EvolveGroup, 'filter'> & { filter?: Maybe<ResolversTypes['ActionFilter']> }>;
  Field: ResolverTypeWrapper<Omit<Field, 'defaultAnswer' | 'optionsConfig'> & { defaultAnswer?: Maybe<ResolversTypes['Value']>, optionsConfig?: Maybe<ResolversTypes['OptionsConfig']> }>;
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  FieldSet: ResolverTypeWrapper<Omit<FieldSet, 'fields'> & { fields: Array<ResolversTypes['Field']> }>;
  FieldSetArgs: FieldSetArgs;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FloatValue: ResolverTypeWrapper<FloatValue>;
  Flow: ResolverTypeWrapper<Omit<Flow, 'evolve' | 'fieldSet' | 'group' | 'steps' | 'trigger' | 'watching'> & { evolve?: Maybe<ResolversTypes['Flow']>, fieldSet: ResolversTypes['FieldSet'], group?: Maybe<ResolversTypes['Group']>, steps: Array<ResolversTypes['Step']>, trigger: ResolversTypes['TriggerConfig'], watching: ResolversTypes['FlowWatchers'] }>;
  FlowReference: ResolverTypeWrapper<FlowReference>;
  FlowSummary: ResolverTypeWrapper<Omit<FlowSummary, 'creator' | 'group' | 'trigger' | 'watching'> & { creator: ResolversTypes['Entity'], group?: Maybe<ResolversTypes['Group']>, trigger: ResolversTypes['TriggerConfig'], watching: ResolversTypes['FlowWatchers'] }>;
  FlowType: FlowType;
  FlowVersionValue: ResolverTypeWrapper<FlowVersionValue>;
  FlowWatchers: ResolverTypeWrapper<Omit<FlowWatchers, 'groups'> & { groups: Array<ResolversTypes['Group']> }>;
  FlowsValue: ResolverTypeWrapper<FlowsValue>;
  Group: ResolverTypeWrapper<Omit<Group, 'groupType'> & { groupType: ResolversTypes['GroupType'] }>;
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupFlowArgs: GroupFlowArgs;
  GroupFlowPolicyArgs: GroupFlowPolicyArgs;
  GroupFlowPolicyType: GroupFlowPolicyType;
  GroupHatArgs: GroupHatArgs;
  GroupIze: ResolverTypeWrapper<GroupIze>;
  GroupNft: ResolverTypeWrapper<GroupNft>;
  GroupNftArgs: GroupNftArgs;
  GroupTelegramChat: ResolverTypeWrapper<GroupTelegramChat>;
  GroupType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GroupType']>;
  GroupWatchFlow: ResolverTypeWrapper<Omit<GroupWatchFlow, 'filter'> & { filter?: Maybe<ResolversTypes['ActionFilter']> }>;
  Identity: ResolverTypeWrapper<Omit<Identity, 'identityType'> & { identityType: ResolversTypes['IdentityType'] }>;
  IdentityBlockchain: ResolverTypeWrapper<IdentityBlockchain>;
  IdentityBlockchainArgs: IdentityBlockchainArgs;
  IdentityDiscord: ResolverTypeWrapper<IdentityDiscord>;
  IdentityDiscordArgs: IdentityDiscordArgs;
  IdentityEmail: ResolverTypeWrapper<IdentityEmail>;
  IdentityEmailArgs: IdentityEmailArgs;
  IdentityTelegram: ResolverTypeWrapper<IdentityTelegram>;
  IdentityType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['IdentityType']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IzeGroup: ResolverTypeWrapper<Omit<IzeGroup, 'group' | 'members' | 'notificationEntity'> & { group: ResolversTypes['Group'], members: Array<ResolversTypes['Entity']>, notificationEntity?: Maybe<ResolversTypes['Entity']> }>;
  LinkedResult: ResolverTypeWrapper<LinkedResult>;
  LlmSummary: ResolverTypeWrapper<Omit<LlmSummary, 'field'> & { field: ResolversTypes['Field'] }>;
  LlmSummaryArgs: LlmSummaryArgs;
  Me: ResolverTypeWrapper<Omit<Me, 'groups' | 'identities'> & { groups: Array<ResolversTypes['Group']>, identities: Array<ResolversTypes['Identity']> }>;
  Mutation: ResolverTypeWrapper<{}>;
  NewEntityArgs: NewEntityArgs;
  NewEntityTypes: NewEntityTypes;
  NewEvolveRequestArgs: NewEvolveRequestArgs;
  NewFlowArgs: NewFlowArgs;
  NewFlowWithEvolveArgs: NewFlowWithEvolveArgs;
  NewRequestArgs: NewRequestArgs;
  NewResponseArgs: NewResponseArgs;
  NewStepArgs: NewStepArgs;
  NftCollection: ResolverTypeWrapper<NftCollection>;
  NftTypes: NftTypes;
  OnboardedDiscordServer: ResolverTypeWrapper<OnboardedDiscordServer>;
  Option: ResolverTypeWrapper<Omit<Option, 'value'> & { value: ResolversTypes['Value'] }>;
  OptionArgs: OptionArgs;
  OptionSelection: ResolverTypeWrapper<Omit<OptionSelection, 'value'> & { value: ResolversTypes['Value'] }>;
  OptionSelectionArgs: OptionSelectionArgs;
  OptionSelectionType: OptionSelectionType;
  OptionSelectionsValue: ResolverTypeWrapper<Omit<OptionSelectionsValue, 'selections'> & { selections: Array<ResolversTypes['OptionSelection']> }>;
  OptionValue: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['OptionValue']>;
  OptionsConfig: ResolverTypeWrapper<Omit<OptionsConfig, 'linkedResultOptions' | 'options'> & { linkedResultOptions: Array<ResolversTypes['LinkedResult']>, options: Array<ResolversTypes['Option']> }>;
  Organization: ResolverTypeWrapper<Organization>;
  Permission: ResolverTypeWrapper<Omit<Permission, 'entities'> & { entities: Array<ResolversTypes['Entity']> }>;
  PermissionArgs: PermissionArgs;
  PrioritizationArgs: PrioritizationArgs;
  Query: ResolverTypeWrapper<{}>;
  Ranking: ResolverTypeWrapper<Omit<Ranking, 'field'> & { field: ResolversTypes['Field'] }>;
  RawAnswers: ResolverTypeWrapper<Omit<RawAnswers, 'field'> & { field: ResolversTypes['Field'] }>;
  Request: ResolverTypeWrapper<Omit<Request, 'creator' | 'flow' | 'requestSteps' | 'triggerDefinedOptions' | 'triggerFieldAnswers'> & { creator: ResolversTypes['Entity'], flow: ResolversTypes['Flow'], requestSteps: Array<ResolversTypes['RequestStep']>, triggerDefinedOptions: Array<ResolversTypes['TriggerDefinedOptions']>, triggerFieldAnswers: Array<ResolversTypes['TriggerFieldAnswer']> }>;
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: ResolverTypeWrapper<Omit<RequestStep, 'actionExecution' | 'answers' | 'fieldSet' | 'results'> & { actionExecution?: Maybe<ResolversTypes['ActionExecution']>, answers: Array<ResolversTypes['ResponseFieldAnswers']>, fieldSet: ResolversTypes['FieldSet'], results: Array<ResolversTypes['ResultGroup']> }>;
  RequestStepActionSummary: ResolverTypeWrapper<RequestStepActionSummary>;
  RequestStepRespondPermissionFilter: RequestStepRespondPermissionFilter;
  RequestStepStatus: RequestStepStatus;
  RequestStepStatusFilter: RequestStepStatusFilter;
  RequestStepStatuses: ResolverTypeWrapper<RequestStepStatuses>;
  RequestStepSummary: ResolverTypeWrapper<Omit<RequestStepSummary, 'respondPermission' | 'result'> & { respondPermission?: Maybe<ResolversTypes['Permission']>, result?: Maybe<ResolversTypes['ResultGroup']> }>;
  RequestSummary: ResolverTypeWrapper<Omit<RequestSummary, 'creator' | 'currentStep'> & { creator: ResolversTypes['Entity'], currentStep: ResolversTypes['RequestStepSummary'] }>;
  ResponseConfig: ResolverTypeWrapper<Omit<ResponseConfig, 'permission'> & { permission: ResolversTypes['Permission'] }>;
  ResponseConfigArgs: ResponseConfigArgs;
  ResponseFieldAnswers: ResolverTypeWrapper<Omit<ResponseFieldAnswers, 'answers' | 'field'> & { answers: Array<ResolversTypes['UserFieldAnswer']>, field: ResolversTypes['Field'] }>;
  ResponseFieldAnswersOptionsSummary: ResolverTypeWrapper<ResponseFieldAnswersOptionsSummary>;
  ResponseFieldAnswersSummary: ResolverTypeWrapper<ResponseFieldAnswersSummary>;
  Result: ResolverTypeWrapper<Omit<Result, 'resultItems'> & { resultItems: Array<ResolversTypes['ResultItem']> }>;
  ResultArgs: ResultArgs;
  ResultConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ResultConfig']>;
  ResultGroup: ResolverTypeWrapper<Omit<ResultGroup, 'results'> & { results: Array<ResolversTypes['Result']> }>;
  ResultGroupStatus: ResultGroupStatus;
  ResultItem: ResolverTypeWrapper<Omit<ResultItem, 'value'> & { value: ResolversTypes['Value'] }>;
  ResultType: ResultType;
  Status: Status;
  Step: ResolverTypeWrapper<Omit<Step, 'action' | 'fieldSet' | 'response' | 'result'> & { action?: Maybe<ResolversTypes['Action']>, fieldSet: ResolversTypes['FieldSet'], response?: Maybe<ResolversTypes['ResponseConfig']>, result: Array<ResolversTypes['ResultConfig']> }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringValue: ResolverTypeWrapper<StringValue>;
  SystemFieldType: SystemFieldType;
  TestWebhookArgs: TestWebhookArgs;
  TestWebhookTriggerFieldsArgs: TestWebhookTriggerFieldsArgs;
  TriggerConfig: ResolverTypeWrapper<Omit<TriggerConfig, 'permission'> & { permission: ResolversTypes['Permission'] }>;
  TriggerConfigArgs: TriggerConfigArgs;
  TriggerContext: ResolverTypeWrapper<Omit<TriggerContext, 'answers' | 'options'> & { answers: Array<ResolversTypes['TriggerFieldAnswer']>, options: Array<ResolversTypes['TriggerDefinedOptions']> }>;
  TriggerDefinedOptions: ResolverTypeWrapper<Omit<TriggerDefinedOptions, 'options'> & { options: Array<ResolversTypes['Option']> }>;
  TriggerFieldAnswer: ResolverTypeWrapper<Omit<TriggerFieldAnswer, 'answer' | 'field'> & { answer: ResolversTypes['Value'], field: ResolversTypes['Field'] }>;
  TriggerStep: ResolverTypeWrapper<Omit<TriggerStep, 'filter'> & { filter?: Maybe<ResolversTypes['ActionFilter']> }>;
  UpdateProfileArgs: UpdateProfileArgs;
  UriValue: ResolverTypeWrapper<UriValue>;
  User: ResolverTypeWrapper<User>;
  UserFieldAnswer: ResolverTypeWrapper<Omit<UserFieldAnswer, 'answer' | 'creator'> & { answer: ResolversTypes['Value'], creator: ResolversTypes['Entity'] }>;
  Value: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Value']>;
  ValueType: ValueType;
  WatchFilter: WatchFilter;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Action: ResolversUnionTypes<ResolversParentTypes>['Action'];
  ActionArgs: ActionArgs;
  ActionExecution: ActionExecution;
  ActionFilter: Omit<ActionFilter, 'option'> & { option: ResolversParentTypes['Option'] };
  ActionFilterArgs: ActionFilterArgs;
  AlchemyApiNftContract: AlchemyApiNftContract;
  AlchemyApiNftToken: AlchemyApiNftToken;
  ApiHatToken: ApiHatToken;
  Boolean: Scalars['Boolean']['output'];
  CallWebhook: Omit<CallWebhook, 'filter'> & { filter?: Maybe<ResolversParentTypes['ActionFilter']> };
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  DateTimeValue: DateTimeValue;
  DateValue: DateValue;
  Decision: Omit<Decision, 'defaultOption' | 'field'> & { defaultOption?: Maybe<ResolversParentTypes['Option']>, field: ResolversParentTypes['Field'] };
  DecisionArgs: DecisionArgs;
  DiscordAPIServerRole: DiscordApiServerRole;
  DiscordRoleGroup: DiscordRoleGroup;
  DiscordServer: DiscordServer;
  EntitiesValue: Omit<EntitiesValue, 'entities'> & { entities: Array<ResolversParentTypes['Entity']> };
  Entity: ResolversUnionTypes<ResolversParentTypes>['Entity'];
  EntityArgs: EntityArgs;
  EvolveFlow: Omit<EvolveFlow, 'filter'> & { filter?: Maybe<ResolversParentTypes['ActionFilter']> };
  EvolveGroup: Omit<EvolveGroup, 'filter'> & { filter?: Maybe<ResolversParentTypes['ActionFilter']> };
  Field: Omit<Field, 'defaultAnswer' | 'optionsConfig'> & { defaultAnswer?: Maybe<ResolversParentTypes['Value']>, optionsConfig?: Maybe<ResolversParentTypes['OptionsConfig']> };
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  FieldSet: Omit<FieldSet, 'fields'> & { fields: Array<ResolversParentTypes['Field']> };
  FieldSetArgs: FieldSetArgs;
  Float: Scalars['Float']['output'];
  FloatValue: FloatValue;
  Flow: Omit<Flow, 'evolve' | 'fieldSet' | 'group' | 'steps' | 'trigger' | 'watching'> & { evolve?: Maybe<ResolversParentTypes['Flow']>, fieldSet: ResolversParentTypes['FieldSet'], group?: Maybe<ResolversParentTypes['Group']>, steps: Array<ResolversParentTypes['Step']>, trigger: ResolversParentTypes['TriggerConfig'], watching: ResolversParentTypes['FlowWatchers'] };
  FlowReference: FlowReference;
  FlowSummary: Omit<FlowSummary, 'creator' | 'group' | 'trigger' | 'watching'> & { creator: ResolversParentTypes['Entity'], group?: Maybe<ResolversParentTypes['Group']>, trigger: ResolversParentTypes['TriggerConfig'], watching: ResolversParentTypes['FlowWatchers'] };
  FlowVersionValue: FlowVersionValue;
  FlowWatchers: Omit<FlowWatchers, 'groups'> & { groups: Array<ResolversParentTypes['Group']> };
  FlowsValue: FlowsValue;
  Group: Omit<Group, 'groupType'> & { groupType: ResolversParentTypes['GroupType'] };
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupFlowArgs: GroupFlowArgs;
  GroupFlowPolicyArgs: GroupFlowPolicyArgs;
  GroupHatArgs: GroupHatArgs;
  GroupIze: GroupIze;
  GroupNft: GroupNft;
  GroupNftArgs: GroupNftArgs;
  GroupTelegramChat: GroupTelegramChat;
  GroupType: ResolversUnionTypes<ResolversParentTypes>['GroupType'];
  GroupWatchFlow: Omit<GroupWatchFlow, 'filter'> & { filter?: Maybe<ResolversParentTypes['ActionFilter']> };
  Identity: Omit<Identity, 'identityType'> & { identityType: ResolversParentTypes['IdentityType'] };
  IdentityBlockchain: IdentityBlockchain;
  IdentityBlockchainArgs: IdentityBlockchainArgs;
  IdentityDiscord: IdentityDiscord;
  IdentityDiscordArgs: IdentityDiscordArgs;
  IdentityEmail: IdentityEmail;
  IdentityEmailArgs: IdentityEmailArgs;
  IdentityTelegram: IdentityTelegram;
  IdentityType: ResolversUnionTypes<ResolversParentTypes>['IdentityType'];
  Int: Scalars['Int']['output'];
  IzeGroup: Omit<IzeGroup, 'group' | 'members' | 'notificationEntity'> & { group: ResolversParentTypes['Group'], members: Array<ResolversParentTypes['Entity']>, notificationEntity?: Maybe<ResolversParentTypes['Entity']> };
  LinkedResult: LinkedResult;
  LlmSummary: Omit<LlmSummary, 'field'> & { field: ResolversParentTypes['Field'] };
  LlmSummaryArgs: LlmSummaryArgs;
  Me: Omit<Me, 'groups' | 'identities'> & { groups: Array<ResolversParentTypes['Group']>, identities: Array<ResolversParentTypes['Identity']> };
  Mutation: {};
  NewEntityArgs: NewEntityArgs;
  NewEvolveRequestArgs: NewEvolveRequestArgs;
  NewFlowArgs: NewFlowArgs;
  NewFlowWithEvolveArgs: NewFlowWithEvolveArgs;
  NewRequestArgs: NewRequestArgs;
  NewResponseArgs: NewResponseArgs;
  NewStepArgs: NewStepArgs;
  NftCollection: NftCollection;
  OnboardedDiscordServer: OnboardedDiscordServer;
  Option: Omit<Option, 'value'> & { value: ResolversParentTypes['Value'] };
  OptionArgs: OptionArgs;
  OptionSelection: Omit<OptionSelection, 'value'> & { value: ResolversParentTypes['Value'] };
  OptionSelectionArgs: OptionSelectionArgs;
  OptionSelectionsValue: Omit<OptionSelectionsValue, 'selections'> & { selections: Array<ResolversParentTypes['OptionSelection']> };
  OptionValue: ResolversUnionTypes<ResolversParentTypes>['OptionValue'];
  OptionsConfig: Omit<OptionsConfig, 'linkedResultOptions' | 'options'> & { linkedResultOptions: Array<ResolversParentTypes['LinkedResult']>, options: Array<ResolversParentTypes['Option']> };
  Organization: Organization;
  Permission: Omit<Permission, 'entities'> & { entities: Array<ResolversParentTypes['Entity']> };
  PermissionArgs: PermissionArgs;
  PrioritizationArgs: PrioritizationArgs;
  Query: {};
  Ranking: Omit<Ranking, 'field'> & { field: ResolversParentTypes['Field'] };
  RawAnswers: Omit<RawAnswers, 'field'> & { field: ResolversParentTypes['Field'] };
  Request: Omit<Request, 'creator' | 'flow' | 'requestSteps' | 'triggerDefinedOptions' | 'triggerFieldAnswers'> & { creator: ResolversParentTypes['Entity'], flow: ResolversParentTypes['Flow'], requestSteps: Array<ResolversParentTypes['RequestStep']>, triggerDefinedOptions: Array<ResolversParentTypes['TriggerDefinedOptions']>, triggerFieldAnswers: Array<ResolversParentTypes['TriggerFieldAnswer']> };
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: Omit<RequestStep, 'actionExecution' | 'answers' | 'fieldSet' | 'results'> & { actionExecution?: Maybe<ResolversParentTypes['ActionExecution']>, answers: Array<ResolversParentTypes['ResponseFieldAnswers']>, fieldSet: ResolversParentTypes['FieldSet'], results: Array<ResolversParentTypes['ResultGroup']> };
  RequestStepActionSummary: RequestStepActionSummary;
  RequestStepStatuses: RequestStepStatuses;
  RequestStepSummary: Omit<RequestStepSummary, 'respondPermission' | 'result'> & { respondPermission?: Maybe<ResolversParentTypes['Permission']>, result?: Maybe<ResolversParentTypes['ResultGroup']> };
  RequestSummary: Omit<RequestSummary, 'creator' | 'currentStep'> & { creator: ResolversParentTypes['Entity'], currentStep: ResolversParentTypes['RequestStepSummary'] };
  ResponseConfig: Omit<ResponseConfig, 'permission'> & { permission: ResolversParentTypes['Permission'] };
  ResponseConfigArgs: ResponseConfigArgs;
  ResponseFieldAnswers: Omit<ResponseFieldAnswers, 'answers' | 'field'> & { answers: Array<ResolversParentTypes['UserFieldAnswer']>, field: ResolversParentTypes['Field'] };
  ResponseFieldAnswersOptionsSummary: ResponseFieldAnswersOptionsSummary;
  ResponseFieldAnswersSummary: ResponseFieldAnswersSummary;
  Result: Omit<Result, 'resultItems'> & { resultItems: Array<ResolversParentTypes['ResultItem']> };
  ResultArgs: ResultArgs;
  ResultConfig: ResolversUnionTypes<ResolversParentTypes>['ResultConfig'];
  ResultGroup: Omit<ResultGroup, 'results'> & { results: Array<ResolversParentTypes['Result']> };
  ResultItem: Omit<ResultItem, 'value'> & { value: ResolversParentTypes['Value'] };
  Step: Omit<Step, 'action' | 'fieldSet' | 'response' | 'result'> & { action?: Maybe<ResolversParentTypes['Action']>, fieldSet: ResolversParentTypes['FieldSet'], response?: Maybe<ResolversParentTypes['ResponseConfig']>, result: Array<ResolversParentTypes['ResultConfig']> };
  String: Scalars['String']['output'];
  StringValue: StringValue;
  TestWebhookArgs: TestWebhookArgs;
  TestWebhookTriggerFieldsArgs: TestWebhookTriggerFieldsArgs;
  TriggerConfig: Omit<TriggerConfig, 'permission'> & { permission: ResolversParentTypes['Permission'] };
  TriggerConfigArgs: TriggerConfigArgs;
  TriggerContext: Omit<TriggerContext, 'answers' | 'options'> & { answers: Array<ResolversParentTypes['TriggerFieldAnswer']>, options: Array<ResolversParentTypes['TriggerDefinedOptions']> };
  TriggerDefinedOptions: Omit<TriggerDefinedOptions, 'options'> & { options: Array<ResolversParentTypes['Option']> };
  TriggerFieldAnswer: Omit<TriggerFieldAnswer, 'answer' | 'field'> & { answer: ResolversParentTypes['Value'], field: ResolversParentTypes['Field'] };
  TriggerStep: Omit<TriggerStep, 'filter'> & { filter?: Maybe<ResolversParentTypes['ActionFilter']> };
  UpdateProfileArgs: UpdateProfileArgs;
  UriValue: UriValue;
  User: User;
  UserFieldAnswer: Omit<UserFieldAnswer, 'answer' | 'creator'> & { answer: ResolversParentTypes['Value'], creator: ResolversParentTypes['Entity'] };
  Value: ResolversUnionTypes<ResolversParentTypes>['Value'];
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

export type ActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = {
  __resolveType: TypeResolveFn<'CallWebhook' | 'EvolveFlow' | 'EvolveGroup' | 'GroupWatchFlow' | 'TriggerStep', ParentType, ContextType>;
};

export type ActionExecutionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ActionExecution'] = ResolversParentTypes['ActionExecution']> = {
  actionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastAttemptedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ActionStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionFilterResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ActionFilter'] = ResolversParentTypes['ActionFilter']> = {
  option?: Resolver<ResolversTypes['Option'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlchemyApiNftContractResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['AlchemyApiNftContract'] = ResolversParentTypes['AlchemyApiNftContract']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Blockchain'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NftTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlchemyApiNftTokenResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['AlchemyApiNftToken'] = ResolversParentTypes['AlchemyApiNftToken']> = {
  chain?: Resolver<ResolversTypes['Blockchain'], ParentType, ContextType>;
  contract?: Resolver<ResolversTypes['AlchemyApiNftContract'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApiHatTokenResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ApiHatToken'] = ResolversParentTypes['ApiHatToken']> = {
  chain?: Resolver<ResolversTypes['Blockchain'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  readableTokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topHatIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topHatName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CallWebhookResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['CallWebhook'] = ResolversParentTypes['CallWebhook']> = {
  filter?: Resolver<Maybe<ResolversTypes['ActionFilter']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webhookId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webhookName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DateTimeValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DateTimeValue'] = ResolversParentTypes['DateTimeValue']> = {
  dateTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DateValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DateValue'] = ResolversParentTypes['DateValue']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DecisionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Decision'] = ResolversParentTypes['Decision']> = {
  criteria?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decisionType?: Resolver<ResolversTypes['DecisionType'], ParentType, ContextType>;
  defaultOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  threshold?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DiscordApiServerRoleResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DiscordAPIServerRole'] = ResolversParentTypes['DiscordAPIServerRole']> = {
  botRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unicodeEmoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DiscordRoleGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DiscordRoleGroup'] = ResolversParentTypes['DiscordRoleGroup']> = {
  color?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  discordRoleId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordServer?: Resolver<ResolversTypes['OnboardedDiscordServer'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  memberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unicodeEmoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DiscordServerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DiscordServer'] = ResolversParentTypes['DiscordServer']> = {
  hasCultsBot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EntitiesValue'] = ResolversParentTypes['EntitiesValue']> = {
  entities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  __resolveType: TypeResolveFn<'Group' | 'Identity' | 'User', ParentType, ContextType>;
};

export type EvolveFlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveFlow'] = ResolversParentTypes['EvolveFlow']> = {
  filter?: Resolver<Maybe<ResolversTypes['ActionFilter']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EvolveGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveGroup'] = ResolversParentTypes['EvolveGroup']> = {
  filter?: Resolver<Maybe<ResolversTypes['ActionFilter']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = {
  defaultAnswer?: Resolver<Maybe<ResolversTypes['Value']>, ParentType, ContextType>;
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isInternal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionsConfig?: Resolver<Maybe<ResolversTypes['OptionsConfig']>, ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  systemType?: Resolver<Maybe<ResolversTypes['SystemFieldType']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ValueType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldSetResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FieldSet'] = ResolversParentTypes['FieldSet']> = {
  fields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FloatValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FloatValue'] = ResolversParentTypes['FloatValue']> = {
  float?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Flow'] = ResolversParentTypes['Flow']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentFlowVersionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evolve?: Resolver<Maybe<ResolversTypes['Flow']>, ParentType, ContextType>;
  fieldSet?: Resolver<ResolversTypes['FieldSet'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowVersionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowsEvolvedByThisFlow?: Resolver<Array<ResolversTypes['FlowReference']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reusable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  steps?: Resolver<Array<ResolversTypes['Step']>, ParentType, ContextType>;
  trigger?: Resolver<ResolversTypes['TriggerConfig'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FlowType'], ParentType, ContextType>;
  versionCreatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  versionPublishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  watching?: Resolver<ResolversTypes['FlowWatchers'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowReferenceResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowReference'] = ResolversParentTypes['FlowReference']> = {
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowVersionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowSummary'] = ResolversParentTypes['FlowSummary']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trigger?: Resolver<ResolversTypes['TriggerConfig'], ParentType, ContextType>;
  watching?: Resolver<ResolversTypes['FlowWatchers'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowVersionValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowVersionValue'] = ResolversParentTypes['FlowVersionValue']> = {
  flowVersion?: Resolver<ResolversTypes['FlowReference'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowWatchersResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowWatchers'] = ResolversParentTypes['FlowWatchers']> = {
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowsValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowsValue'] = ResolversParentTypes['FlowsValue']> = {
  flows?: Resolver<Array<ResolversTypes['FlowReference']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupType?: Resolver<ResolversTypes['GroupType'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isMember?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isWatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  memberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupIzeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupIze'] = ResolversParentTypes['GroupIze']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupNftResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupNft'] = ResolversParentTypes['GroupNft']> = {
  NftCollection?: Resolver<ResolversTypes['NftCollection'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupTelegramChatResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupTelegramChat'] = ResolversParentTypes['GroupTelegramChat']> = {
  chatId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messageThreadId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupType'] = ResolversParentTypes['GroupType']> = {
  __resolveType: TypeResolveFn<'DiscordRoleGroup' | 'GroupIze' | 'GroupNft' | 'GroupTelegramChat', ParentType, ContextType>;
};

export type GroupWatchFlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupWatchFlow'] = ResolversParentTypes['GroupWatchFlow']> = {
  filter?: Resolver<Maybe<ResolversTypes['ActionFilter']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Identity'] = ResolversParentTypes['Identity']> = {
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identityType?: Resolver<ResolversTypes['IdentityType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityBlockchainResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityBlockchain'] = ResolversParentTypes['IdentityBlockchain']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityDiscordResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityDiscord'] = ResolversParentTypes['IdentityDiscord']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityEmailResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityEmail'] = ResolversParentTypes['IdentityEmail']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityTelegramResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityTelegram'] = ResolversParentTypes['IdentityTelegram']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityType'] = ResolversParentTypes['IdentityType']> = {
  __resolveType: TypeResolveFn<'IdentityBlockchain' | 'IdentityDiscord' | 'IdentityEmail' | 'IdentityTelegram', ParentType, ContextType>;
};

export type IzeGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IzeGroup'] = ResolversParentTypes['IzeGroup']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evolveGroupFlowId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  notificationEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkedResultResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LinkedResult'] = ResolversParentTypes['LinkedResult']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LlmSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LlmSummary'] = ResolversParentTypes['LlmSummary']> = {
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  isList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  identities?: Resolver<Array<ResolversTypes['Identity']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  endRequestStep?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationEndRequestStepArgs, 'requestStepId'>>;
  newCustomGroup?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewCustomGroupArgs, 'inputs'>>;
  newEntities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationNewEntitiesArgs, 'entities'>>;
  newEvolveRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewEvolveRequestArgs, 'request'>>;
  newFlow?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewFlowArgs, 'new'>>;
  newRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewRequestArgs, 'request'>>;
  newResponse?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewResponseArgs, 'response'>>;
  testWebhook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTestWebhookArgs, 'inputs'>>;
  updateProfile?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'profile'>>;
  watchFlow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationWatchFlowArgs, 'flowId' | 'watch'>>;
  watchGroup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationWatchGroupArgs, 'groupId' | 'watch'>>;
};

export type NftCollectionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['NftCollection'] = ResolversParentTypes['NftCollection']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Blockchain'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NftTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OnboardedDiscordServerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OnboardedDiscordServer'] = ResolversParentTypes['OnboardedDiscordServer']> = {
  banner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordServerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Option'] = ResolversParentTypes['Option']> = {
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Value'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionSelectionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionSelection'] = ResolversParentTypes['OptionSelection']> = {
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Value'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionSelectionsValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionSelectionsValue'] = ResolversParentTypes['OptionSelectionsValue']> = {
  selections?: Resolver<Array<ResolversTypes['OptionSelection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionValue'] = ResolversParentTypes['OptionValue']> = {
  __resolveType: TypeResolveFn<'DateTimeValue' | 'DateValue' | 'EntitiesValue' | 'FloatValue' | 'FlowVersionValue' | 'FlowsValue' | 'StringValue' | 'UriValue', ParentType, ContextType>;
};

export type OptionsConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionsConfig'] = ResolversParentTypes['OptionsConfig']> = {
  linkedResultOptions?: Resolver<Array<ResolversTypes['LinkedResult']>, ParentType, ContextType>;
  maxSelections?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['Option']>, ParentType, ContextType>;
  selectionType?: Resolver<ResolversTypes['OptionSelectionType'], ParentType, ContextType>;
  systemType?: Resolver<Maybe<ResolversTypes['SystemFieldType']>, ParentType, ContextType>;
  triggerOptionsType?: Resolver<Maybe<ResolversTypes['ValueType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = {
  anyone?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  entities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  discordServerRoles?: Resolver<Array<ResolversTypes['DiscordAPIServerRole']>, ParentType, ContextType, RequireFields<QueryDiscordServerRolesArgs, 'serverId'>>;
  getDiscordServers?: Resolver<Array<ResolversTypes['DiscordServer']>, ParentType, ContextType>;
  getFlow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType, Partial<QueryGetFlowArgs>>;
  getFlows?: Resolver<Array<ResolversTypes['FlowSummary']>, ParentType, ContextType, RequireFields<QueryGetFlowsArgs, 'createdByUser' | 'hasTriggerPermissions' | 'limit' | 'searchQuery' | 'watchedByUser' | 'watchedByUserGroups'>>;
  getRequest?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<QueryGetRequestArgs, 'requestId'>>;
  getRequests?: Resolver<Array<ResolversTypes['RequestSummary']>, ParentType, ContextType, RequireFields<QueryGetRequestsArgs, 'createdByUser' | 'hasRespondPermission' | 'limit' | 'open' | 'searchQuery' | 'watchedByUser' | 'watchedByUserGroups'>>;
  group?: Resolver<ResolversTypes['IzeGroup'], ParentType, ContextType, RequireFields<QueryGroupArgs, 'id'>>;
  groupsForCurrentUser?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGroupsForCurrentUserArgs, 'limit' | 'searchQuery' | 'watchFilter'>>;
  hatToken?: Resolver<Maybe<ResolversTypes['ApiHatToken']>, ParentType, ContextType, RequireFields<QueryHatTokenArgs, 'chain' | 'tokenId'>>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QueryNftContractArgs, 'address' | 'chain'>>;
  nftToken?: Resolver<Maybe<ResolversTypes['AlchemyApiNftToken']>, ParentType, ContextType, RequireFields<QueryNftTokenArgs, 'address' | 'chain' | 'tokenId'>>;
  searchNftContracts?: Resolver<Array<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QuerySearchNftContractsArgs, 'chain' | 'query'>>;
  telegramChats?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<QueryTelegramChatsArgs, 'adminOnly'>>;
};

export type RankingResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Ranking'] = ResolversParentTypes['Ranking']> = {
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numOptionsToInclude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RawAnswersResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RawAnswers'] = ResolversParentTypes['RawAnswers']> = {
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Request'] = ResolversParentTypes['Request']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  currentStepIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  flow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestSteps?: Resolver<Array<ResolversTypes['RequestStep']>, ParentType, ContextType>;
  triggerDefinedOptions?: Resolver<Array<ResolversTypes['TriggerDefinedOptions']>, ParentType, ContextType>;
  triggerFieldAnswers?: Resolver<Array<ResolversTypes['TriggerFieldAnswer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStep'] = ResolversParentTypes['RequestStep']> = {
  actionExecution?: Resolver<Maybe<ResolversTypes['ActionExecution']>, ParentType, ContextType>;
  answers?: Resolver<Array<ResolversTypes['ResponseFieldAnswers']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldSet?: Resolver<ResolversTypes['FieldSet'], ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['ResultGroup']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStepStatuses'], ParentType, ContextType>;
  stepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userResponded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepActionSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStepActionSummary'] = ResolversParentTypes['RequestStepActionSummary']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ActionStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepStatusesResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStepStatuses'] = ResolversParentTypes['RequestStepStatuses']> = {
  actionsFinal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  responseFinal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resultsFinal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStepStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStepSummary'] = ResolversParentTypes['RequestStepSummary']> = {
  action?: Resolver<Maybe<ResolversTypes['RequestStepActionSummary']>, ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  respondPermission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['ResultGroup']>, ParentType, ContextType>;
  resultName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RequestStepStatuses'], ParentType, ContextType>;
  userRespondPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userResponded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestSummary'] = ResolversParentTypes['RequestSummary']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  currentStep?: Resolver<ResolversTypes['RequestStepSummary'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseConfig'] = ResolversParentTypes['ResponseConfig']> = {
  allowMultipleResponses?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  canBeManuallyEnded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expirationSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minResponses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseFieldAnswersResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseFieldAnswers'] = ResolversParentTypes['ResponseFieldAnswers']> = {
  answers?: Resolver<Array<ResolversTypes['UserFieldAnswer']>, ParentType, ContextType>;
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['ResponseFieldAnswersSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseFieldAnswersOptionsSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseFieldAnswersOptionsSummary'] = ResolversParentTypes['ResponseFieldAnswersOptionsSummary']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseFieldAnswersSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseFieldAnswersSummary'] = ResolversParentTypes['ResponseFieldAnswersSummary']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<ResolversTypes['ResponseFieldAnswersOptionsSummary']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultItems?: Resolver<Array<ResolversTypes['ResultItem']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultConfig'] = ResolversParentTypes['ResultConfig']> = {
  __resolveType: TypeResolveFn<'Decision' | 'LlmSummary' | 'Ranking' | 'RawAnswers', ParentType, ContextType>;
};

export type ResultGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultGroup'] = ResolversParentTypes['ResultGroup']> = {
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ResultGroupStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultItemResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultItem'] = ResolversParentTypes['ResultItem']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Value'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Step'] = ResolversParentTypes['Step']> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  fieldSet?: Resolver<ResolversTypes['FieldSet'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  response?: Resolver<Maybe<ResolversTypes['ResponseConfig']>, ParentType, ContextType>;
  result?: Resolver<Array<ResolversTypes['ResultConfig']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StringValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['StringValue'] = ResolversParentTypes['StringValue']> = {
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerConfig'] = ResolversParentTypes['TriggerConfig']> = {
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerContextResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerContext'] = ResolversParentTypes['TriggerContext']> = {
  answers?: Resolver<Array<ResolversTypes['TriggerFieldAnswer']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['TriggerDefinedOptions']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerDefinedOptionsResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerDefinedOptions'] = ResolversParentTypes['TriggerDefinedOptions']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['Option']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerFieldAnswer'] = ResolversParentTypes['TriggerFieldAnswer']> = {
  answer?: Resolver<ResolversTypes['Value'], ParentType, ContextType>;
  field?: Resolver<ResolversTypes['Field'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerStep'] = ResolversParentTypes['TriggerStep']> = {
  filter?: Resolver<Maybe<ResolversTypes['ActionFilter']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UriValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UriValue'] = ResolversParentTypes['UriValue']> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserFieldAnswer'] = ResolversParentTypes['UserFieldAnswer']> = {
  answer?: Resolver<ResolversTypes['Value'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Value'] = ResolversParentTypes['Value']> = {
  __resolveType: TypeResolveFn<'DateTimeValue' | 'DateValue' | 'EntitiesValue' | 'FloatValue' | 'FlowVersionValue' | 'FlowsValue' | 'OptionSelectionsValue' | 'StringValue' | 'UriValue', ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphqlRequestContext> = {
  Action?: ActionResolvers<ContextType>;
  ActionExecution?: ActionExecutionResolvers<ContextType>;
  ActionFilter?: ActionFilterResolvers<ContextType>;
  AlchemyApiNftContract?: AlchemyApiNftContractResolvers<ContextType>;
  AlchemyApiNftToken?: AlchemyApiNftTokenResolvers<ContextType>;
  ApiHatToken?: ApiHatTokenResolvers<ContextType>;
  CallWebhook?: CallWebhookResolvers<ContextType>;
  DateTimeValue?: DateTimeValueResolvers<ContextType>;
  DateValue?: DateValueResolvers<ContextType>;
  Decision?: DecisionResolvers<ContextType>;
  DiscordAPIServerRole?: DiscordApiServerRoleResolvers<ContextType>;
  DiscordRoleGroup?: DiscordRoleGroupResolvers<ContextType>;
  DiscordServer?: DiscordServerResolvers<ContextType>;
  EntitiesValue?: EntitiesValueResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EvolveFlow?: EvolveFlowResolvers<ContextType>;
  EvolveGroup?: EvolveGroupResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
  FieldSet?: FieldSetResolvers<ContextType>;
  FloatValue?: FloatValueResolvers<ContextType>;
  Flow?: FlowResolvers<ContextType>;
  FlowReference?: FlowReferenceResolvers<ContextType>;
  FlowSummary?: FlowSummaryResolvers<ContextType>;
  FlowVersionValue?: FlowVersionValueResolvers<ContextType>;
  FlowWatchers?: FlowWatchersResolvers<ContextType>;
  FlowsValue?: FlowsValueResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupIze?: GroupIzeResolvers<ContextType>;
  GroupNft?: GroupNftResolvers<ContextType>;
  GroupTelegramChat?: GroupTelegramChatResolvers<ContextType>;
  GroupType?: GroupTypeResolvers<ContextType>;
  GroupWatchFlow?: GroupWatchFlowResolvers<ContextType>;
  Identity?: IdentityResolvers<ContextType>;
  IdentityBlockchain?: IdentityBlockchainResolvers<ContextType>;
  IdentityDiscord?: IdentityDiscordResolvers<ContextType>;
  IdentityEmail?: IdentityEmailResolvers<ContextType>;
  IdentityTelegram?: IdentityTelegramResolvers<ContextType>;
  IdentityType?: IdentityTypeResolvers<ContextType>;
  IzeGroup?: IzeGroupResolvers<ContextType>;
  LinkedResult?: LinkedResultResolvers<ContextType>;
  LlmSummary?: LlmSummaryResolvers<ContextType>;
  Me?: MeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NftCollection?: NftCollectionResolvers<ContextType>;
  OnboardedDiscordServer?: OnboardedDiscordServerResolvers<ContextType>;
  Option?: OptionResolvers<ContextType>;
  OptionSelection?: OptionSelectionResolvers<ContextType>;
  OptionSelectionsValue?: OptionSelectionsValueResolvers<ContextType>;
  OptionValue?: OptionValueResolvers<ContextType>;
  OptionsConfig?: OptionsConfigResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Ranking?: RankingResolvers<ContextType>;
  RawAnswers?: RawAnswersResolvers<ContextType>;
  Request?: RequestResolvers<ContextType>;
  RequestStep?: RequestStepResolvers<ContextType>;
  RequestStepActionSummary?: RequestStepActionSummaryResolvers<ContextType>;
  RequestStepStatuses?: RequestStepStatusesResolvers<ContextType>;
  RequestStepSummary?: RequestStepSummaryResolvers<ContextType>;
  RequestSummary?: RequestSummaryResolvers<ContextType>;
  ResponseConfig?: ResponseConfigResolvers<ContextType>;
  ResponseFieldAnswers?: ResponseFieldAnswersResolvers<ContextType>;
  ResponseFieldAnswersOptionsSummary?: ResponseFieldAnswersOptionsSummaryResolvers<ContextType>;
  ResponseFieldAnswersSummary?: ResponseFieldAnswersSummaryResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  ResultConfig?: ResultConfigResolvers<ContextType>;
  ResultGroup?: ResultGroupResolvers<ContextType>;
  ResultItem?: ResultItemResolvers<ContextType>;
  Step?: StepResolvers<ContextType>;
  StringValue?: StringValueResolvers<ContextType>;
  TriggerConfig?: TriggerConfigResolvers<ContextType>;
  TriggerContext?: TriggerContextResolvers<ContextType>;
  TriggerDefinedOptions?: TriggerDefinedOptionsResolvers<ContextType>;
  TriggerFieldAnswer?: TriggerFieldAnswerResolvers<ContextType>;
  TriggerStep?: TriggerStepResolvers<ContextType>;
  UriValue?: UriValueResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserFieldAnswer?: UserFieldAnswerResolvers<ContextType>;
  Value?: ValueResolvers<ContextType>;
};

