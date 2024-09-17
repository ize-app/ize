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
  filterOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  filterResponseFieldIndex?: InputMaybe<Scalars['Int']['input']>;
  locked: Scalars['Boolean']['input'];
  type: ActionType;
};

export type ActionExecution = {
  __typename?: 'ActionExecution';
  actionId: Scalars['String']['output'];
  lastAttemptedAt?: Maybe<Scalars['String']['output']>;
  status: Status;
};

export enum ActionType {
  CallWebhook = 'CallWebhook',
  EvolveFlow = 'EvolveFlow',
  EvolveGroup = 'EvolveGroup',
  GroupWatchFlow = 'GroupWatchFlow',
  None = 'None',
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
  filterOption?: Maybe<Option>;
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  uri: Scalars['String']['output'];
  webhookId: Scalars['String']['output'];
};

export type CallWebhookArgs = {
  name: Scalars['String']['input'];
  originalUri?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['String']['input'];
  webhookId?: InputMaybe<Scalars['String']['input']>;
};

export type CustomGroupArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  flows: GroupFlowArgs;
  members: Array<EntityArgs>;
  name: Scalars['String']['input'];
  notificationEntity?: InputMaybe<EntityArgs>;
};

export type Decision = {
  __typename?: 'Decision';
  decisionType: DecisionType;
  defaultOption?: Maybe<Option>;
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  resultConfigId: Scalars['String']['output'];
  threshold?: Maybe<Scalars['Int']['output']>;
};

export type DecisionArgs = {
  defaultOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  threshold?: InputMaybe<Scalars['Int']['input']>;
  type: DecisionType;
};

export enum DecisionType {
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

export type DiscordServerOnboarded = {
  __typename?: 'DiscordServerOnboarded';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EntitiesFieldAnswer = {
  __typename?: 'EntitiesFieldAnswer';
  entities: Array<Entity>;
  fieldId: Scalars['String']['output'];
};

export type Entity = Group | Identity;

export type EntityArgs = {
  id: Scalars['String']['input'];
};

export enum EntityType {
  Group = 'Group',
  Identity = 'Identity'
}

export type EvolveFlow = {
  __typename?: 'EvolveFlow';
  filterOption?: Maybe<Option>;
  locked: Scalars['Boolean']['output'];
};

export type EvolveFlowArgs = {
  decision: DecisionArgs;
  requestPermission: PermissionArgs;
  responsePermission: PermissionArgs;
};

export type EvolveGroup = {
  __typename?: 'EvolveGroup';
  filterOption?: Maybe<Option>;
  locked: Scalars['Boolean']['output'];
};

export type Field = FreeInput | Options;

export type FieldAnswer = EntitiesFieldAnswer | FlowsFieldAnswer | FreeInputFieldAnswer | OptionFieldAnswer | WebhookFieldAnswer;

export type FieldAnswerArgs = {
  fieldId: Scalars['String']['input'];
  optionSelections?: InputMaybe<Array<OptionSelectionArgs>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type FieldArgs = {
  fieldId: Scalars['String']['input'];
  freeInputDataType?: InputMaybe<FieldDataType>;
  name: Scalars['String']['input'];
  optionsConfig?: InputMaybe<FieldOptionsConfigArgs>;
  required: Scalars['Boolean']['input'];
  type: FieldType;
};

export enum FieldDataType {
  Date = 'Date',
  DateTime = 'DateTime',
  EntityIds = 'EntityIds',
  FlowIds = 'FlowIds',
  FlowVersionId = 'FlowVersionId',
  Number = 'Number',
  String = 'String',
  Uri = 'Uri',
  Webhook = 'Webhook'
}

export type FieldOptionArgs = {
  dataType: FieldDataType;
  name: Scalars['String']['input'];
  optionId?: InputMaybe<Scalars['String']['input']>;
};

export type FieldOptionsConfigArgs = {
  linkedResultOptions: Array<LinkedResultOptionsArgs>;
  maxSelections?: InputMaybe<Scalars['Int']['input']>;
  options: Array<FieldOptionArgs>;
  previousStepOptions: Scalars['Boolean']['input'];
  requestOptionsDataType?: InputMaybe<FieldDataType>;
  selectionType: FieldOptionsSelectionType;
};

export enum FieldOptionsSelectionType {
  MultiSelect = 'MultiSelect',
  Rank = 'Rank',
  Select = 'Select'
}

export enum FieldType {
  FreeInput = 'FreeInput',
  Options = 'Options'
}

export type Flow = {
  __typename?: 'Flow';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  currentFlowVersionId?: Maybe<Scalars['String']['output']>;
  evolve?: Maybe<Flow>;
  flowId: Scalars['String']['output'];
  flowVersionId: Scalars['String']['output'];
  flowsEvolvedByThisFlow: Array<FlowReference>;
  group?: Maybe<Group>;
  id: Scalars['String']['output'];
  isWatched: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  reusable: Scalars['Boolean']['output'];
  steps: Array<Step>;
  type: FlowType;
  versionCreatedAt: Scalars['String']['output'];
  versionPublishedAt?: Maybe<Scalars['String']['output']>;
};

export type FlowReference = {
  __typename?: 'FlowReference';
  flowId: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
};

export type FlowSummary = {
  __typename?: 'FlowSummary';
  createdAt: Scalars['String']['output'];
  creator: User;
  flowId: Scalars['String']['output'];
  group?: Maybe<Group>;
  isWatched: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  requestStep0Permission: Permission;
  userPermission: UserFlowPermission;
};

export enum FlowTriggerPermissionFilter {
  All = 'All',
  NoTriggerPermission = 'NoTriggerPermission',
  TriggerPermission = 'TriggerPermission'
}

export enum FlowType {
  Custom = 'Custom',
  Evolve = 'Evolve',
  EvolveGroup = 'EvolveGroup',
  GroupWatchFlow = 'GroupWatchFlow'
}

export type FlowsFieldAnswer = {
  __typename?: 'FlowsFieldAnswer';
  fieldId: Scalars['String']['output'];
  flows: Array<FlowSummary>;
};

export type FreeInput = {
  __typename?: 'FreeInput';
  dataType: FieldDataType;
  defaultAnswer?: Maybe<FieldAnswer>;
  fieldId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type FreeInputFieldAnswer = {
  __typename?: 'FreeInputFieldAnswer';
  fieldId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type GenericFieldAndValue = {
  __typename?: 'GenericFieldAndValue';
  fieldName: Scalars['String']['output'];
  value: Array<Scalars['String']['output']>;
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  creator?: Maybe<User>;
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

export type GroupCustom = {
  __typename?: 'GroupCustom';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export type GroupType = DiscordRoleGroup | GroupCustom | GroupNft | GroupTelegramChat;

export type GroupWatchFlow = {
  __typename?: 'GroupWatchFlow';
  filterOption?: Maybe<Option>;
  locked: Scalars['Boolean']['output'];
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
  avatar?: Maybe<Scalars['String']['output']>;
  discordUserId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type IdentityDiscordArgs = {
  discordUserId: Scalars['String']['input'];
};

export type IdentityEmail = {
  __typename?: 'IdentityEmail';
  email: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type IdentityEmailArgs = {
  email: Scalars['String']['input'];
};

export type IdentityTelegram = {
  __typename?: 'IdentityTelegram';
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  telegramUserId: Scalars['String']['output'];
  telegramUsername?: Maybe<Scalars['String']['output']>;
};

export type IdentityType = IdentityBlockchain | IdentityDiscord | IdentityEmail | IdentityTelegram;

export type IzeGroup = {
  __typename?: 'IzeGroup';
  description?: Maybe<Scalars['String']['output']>;
  group: Group;
  members: Array<Entity>;
  notificationEntity?: Maybe<Entity>;
};

export type LinkedResult = {
  __typename?: 'LinkedResult';
  fieldId: Scalars['String']['output'];
  fieldName: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
  resultType: ResultType;
};

export type LinkedResultOptionsArgs = {
  resultIndex: Scalars['Int']['input'];
  stepIndex: Scalars['Int']['input'];
};

export type LlmSummary = {
  __typename?: 'LlmSummary';
  example?: Maybe<Scalars['String']['output']>;
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  prompt: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
};

export type LlmSummaryArgs = {
  example?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
};

export type LlmSummaryList = {
  __typename?: 'LlmSummaryList';
  example?: Maybe<Scalars['String']['output']>;
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  prompt: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
};

export enum LlmSummaryType {
  AfterEveryResponse = 'AfterEveryResponse',
  AtTheEnd = 'AtTheEnd'
}

export type Me = {
  __typename?: 'Me';
  discordServers: Array<DiscordServer>;
  groups: Array<Group>;
  identities: Array<Identity>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createWebhook: Scalars['String']['output'];
  newCustomGroup: Scalars['String']['output'];
  newEntities: Array<Entity>;
  newEvolveRequest: Scalars['String']['output'];
  newFlow: Scalars['String']['output'];
  newRequest: Scalars['String']['output'];
  newResponse: Scalars['String']['output'];
  testNotificationWebhook: Scalars['Boolean']['output'];
  testWebhook: Scalars['Boolean']['output'];
  updateProfile: Scalars['Boolean']['output'];
  watchFlow: Scalars['Boolean']['output'];
  watchGroup: Scalars['Boolean']['output'];
};


export type MutationCreateWebhookArgs = {
  inputs: CallWebhookArgs;
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
  flow: NewFlowArgs;
};


export type MutationNewRequestArgs = {
  request: NewRequestArgs;
};


export type MutationNewResponseArgs = {
  response: NewResponseArgs;
};


export type MutationTestNotificationWebhookArgs = {
  uri: Scalars['String']['input'];
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
  currentFlow: NewFlowArgs;
  description?: InputMaybe<Scalars['String']['input']>;
  flowId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  proposedFlow: NewFlowArgs;
};

export type NewFlowArgs = {
  evolve: EvolveFlowArgs;
  name: Scalars['String']['input'];
  reusable: Scalars['Boolean']['input'];
  steps: Array<NewStepArgs>;
};

export type NewRequestArgs = {
  flowId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requestDefinedOptions: Array<RequestDefinedOptionsArgs>;
  requestFields: Array<FieldAnswerArgs>;
};

export type NewResponseArgs = {
  answers: Array<FieldAnswerArgs>;
  requestStepId: Scalars['String']['input'];
};

export type NewStepArgs = {
  action?: InputMaybe<ActionArgs>;
  allowMultipleResponses: Scalars['Boolean']['input'];
  expirationSeconds?: InputMaybe<Scalars['Int']['input']>;
  request?: InputMaybe<StepRequestArgs>;
  response?: InputMaybe<StepResponseArgs>;
  result: Array<ResultArgs>;
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
  dataType: FieldDataType;
  name: Scalars['String']['output'];
  optionId: Scalars['String']['output'];
};

export type OptionFieldAnswer = {
  __typename?: 'OptionFieldAnswer';
  fieldId: Scalars['String']['output'];
  selections: Array<OptionFieldAnswerSelection>;
};

export type OptionFieldAnswerSelection = {
  __typename?: 'OptionFieldAnswerSelection';
  optionId?: Maybe<Scalars['String']['output']>;
};

export type OptionSelectionArgs = {
  optionId: Scalars['String']['input'];
};

export type Options = {
  __typename?: 'Options';
  fieldId: Scalars['String']['output'];
  linkedResultOptions: Array<LinkedResult>;
  maxSelections?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  options: Array<Option>;
  previousStepOptions: Scalars['Boolean']['output'];
  requestOptionsDataType?: Maybe<FieldDataType>;
  required: Scalars['Boolean']['output'];
  selectionType: FieldOptionsSelectionType;
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
  stepTriggered: Scalars['Boolean']['output'];
};

export type PermissionArgs = {
  anyone: Scalars['Boolean']['input'];
  entities: Array<EntityArgs>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type PrioritizationArgs = {
  numPrioritizedItems?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  getFlow: Flow;
  getFlows: Array<FlowSummary>;
  getRequest: Request;
  getRequestSteps: Array<RequestStepSummary>;
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
  cursor?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  searchQuery: Scalars['String']['input'];
  triggerPermissionFilter: FlowTriggerPermissionFilter;
  watchFilter: WatchFilter;
};


export type QueryGetRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryGetRequestStepsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  flowId?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  respondPermissionFilter: RequestStepRespondPermissionFilter;
  searchQuery: Scalars['String']['input'];
  statusFilter: RequestStepStatusFilter;
  userOnly: Scalars['Boolean']['input'];
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

export type Ranking = {
  __typename?: 'Ranking';
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  numOptionsToInclude?: Maybe<Scalars['Int']['output']>;
  resultConfigId: Scalars['String']['output'];
};

export type Request = {
  __typename?: 'Request';
  createdAt: Scalars['String']['output'];
  creator: User;
  currentStepIndex: Scalars['Int']['output'];
  final: Scalars['Boolean']['output'];
  flow: Flow;
  name: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  steps: Array<RequestStep>;
};

export type RequestConfig = {
  __typename?: 'RequestConfig';
  fields: Array<Field>;
  fieldsLocked: Scalars['Boolean']['output'];
  permission?: Maybe<Permission>;
};

export type RequestDefinedOptionsArgs = {
  fieldId: Scalars['String']['input'];
  options: Array<FieldOptionArgs>;
};

export type RequestStep = {
  __typename?: 'RequestStep';
  actionExecution?: Maybe<ActionExecution>;
  createdAt: Scalars['String']['output'];
  expirationDate: Scalars['String']['output'];
  final: Scalars['Boolean']['output'];
  requestFieldAnswers: Array<FieldAnswer>;
  requestStepId: Scalars['String']['output'];
  responseComplete: Scalars['Boolean']['output'];
  responseFieldAnswers: Array<UserFieldAnswers>;
  responseFields: Array<Field>;
  results: Array<Result>;
  resultsComplete: Scalars['Boolean']['output'];
  userResponses: Array<Response>;
};

export enum RequestStepRespondPermissionFilter {
  All = 'All',
  NoRespondPermission = 'NoRespondPermission',
  RespondPermission = 'RespondPermission'
}

export enum RequestStepStatusFilter {
  All = 'All',
  Closed = 'Closed',
  Open = 'Open'
}

export type RequestStepSummary = {
  __typename?: 'RequestStepSummary';
  actionsComplete: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  creator: User;
  expirationDate: Scalars['String']['output'];
  final: Scalars['Boolean']['output'];
  flowId: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  requestName: Scalars['String']['output'];
  requestStepId: Scalars['String']['output'];
  respondPermission?: Maybe<Permission>;
  responseComplete: Scalars['Boolean']['output'];
  resultsComplete: Scalars['Boolean']['output'];
  stepIndex: Scalars['Int']['output'];
  totalSteps: Scalars['Int']['output'];
  userRespondPermission: Scalars['Boolean']['output'];
  userResponded: Scalars['Boolean']['output'];
};

export type Response = {
  __typename?: 'Response';
  answers: Array<FieldAnswer>;
  createdAt: Scalars['String']['output'];
  responseId: Scalars['String']['output'];
  user: User;
};

export type ResponseConfig = {
  __typename?: 'ResponseConfig';
  fields: Array<Field>;
  fieldsLocked: Scalars['Boolean']['output'];
  permission?: Maybe<Permission>;
};

export type Result = {
  __typename?: 'Result';
  createdAt: Scalars['String']['output'];
  hasResult: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  resultConfigId: Scalars['String']['output'];
  resultItems: Array<ResultItem>;
};

export type ResultArgs = {
  decision?: InputMaybe<DecisionArgs>;
  fieldId?: InputMaybe<Scalars['String']['input']>;
  llmSummary?: InputMaybe<LlmSummaryArgs>;
  minimumAnswers?: InputMaybe<Scalars['Int']['input']>;
  prioritization?: InputMaybe<PrioritizationArgs>;
  responseFieldIndex: Scalars['Int']['input'];
  resultId?: InputMaybe<Scalars['String']['input']>;
  type: ResultType;
};

export type ResultConfig = Decision | LlmSummary | LlmSummaryList | Ranking;

export type ResultItem = {
  __typename?: 'ResultItem';
  dataType: FieldDataType;
  id: Scalars['String']['output'];
  optionId?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export enum ResultType {
  Decision = 'Decision',
  LlmSummary = 'LlmSummary',
  LlmSummaryList = 'LlmSummaryList',
  Ranking = 'Ranking'
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
  allowMultipleResponses: Scalars['Boolean']['output'];
  expirationSeconds?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  request: RequestConfig;
  response: ResponseConfig;
  result: Array<ResultConfig>;
  userPermission: UserPermission;
};

export type StepRequestArgs = {
  fields: Array<FieldArgs>;
  fieldsLocked?: InputMaybe<Scalars['Boolean']['input']>;
  permission: PermissionArgs;
};

export type StepResponseArgs = {
  fields: Array<FieldArgs>;
  fieldsLocked?: InputMaybe<Scalars['Boolean']['input']>;
  permission: PermissionArgs;
};

export type TestWebhookArgs = {
  flowName: Scalars['String']['input'];
  requestFields: Array<WebhookValueArgs>;
  results: Array<WebhookValueArgs>;
  uri: Scalars['String']['input'];
};

export type TriggerStep = {
  __typename?: 'TriggerStep';
  filterOption?: Maybe<Option>;
  locked: Scalars['Boolean']['output'];
};

export type UpdateProfileArgs = {
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UserFieldAnswer = {
  __typename?: 'UserFieldAnswer';
  answer: FieldAnswer;
  createdAt: Scalars['String']['output'];
  user: User;
};

export type UserFieldAnswers = {
  __typename?: 'UserFieldAnswers';
  answers: Array<UserFieldAnswer>;
  fieldId: Scalars['String']['output'];
};

export type UserFlowPermission = {
  __typename?: 'UserFlowPermission';
  request: Scalars['Boolean']['output'];
};

export type UserPermission = {
  __typename?: 'UserPermission';
  request: Scalars['Boolean']['output'];
  response: Scalars['Boolean']['output'];
};

export enum WatchFilter {
  All = 'All',
  Unwatched = 'Unwatched',
  Watched = 'Watched'
}

export type WebhookFieldAnswer = {
  __typename?: 'WebhookFieldAnswer';
  fieldId: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  originalUri?: Maybe<Scalars['String']['output']>;
  uri: Scalars['String']['output'];
  webhookId?: Maybe<Scalars['String']['output']>;
};

export type WebhookPayload = {
  __typename?: 'WebhookPayload';
  createdAt: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
  requestFields: Array<WebhookValue>;
  requestName: Scalars['String']['output'];
  results: Array<WebhookValue>;
};

export type WebhookValue = {
  __typename?: 'WebhookValue';
  fieldName: Scalars['String']['output'];
  optionSelections?: Maybe<Array<Scalars['String']['output']>>;
  value?: Maybe<Scalars['String']['output']>;
};

export type WebhookValueArgs = {
  fieldName: Scalars['String']['input'];
  fieldType: FieldType;
};

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
  Action: ( CallWebhook ) | ( EvolveFlow ) | ( EvolveGroup ) | ( GroupWatchFlow ) | ( TriggerStep );
  Entity: ( Omit<Group, 'creator' | 'groupType'> & { creator?: Maybe<_RefType['User']>, groupType: _RefType['GroupType'] } ) | ( Omit<Identity, 'identityType'> & { identityType: _RefType['IdentityType'] } );
  Field: ( Omit<FreeInput, 'defaultAnswer'> & { defaultAnswer?: Maybe<_RefType['FieldAnswer']> } ) | ( Options );
  FieldAnswer: ( Omit<EntitiesFieldAnswer, 'entities'> & { entities: Array<_RefType['Entity']> } ) | ( Omit<FlowsFieldAnswer, 'flows'> & { flows: Array<_RefType['FlowSummary']> } ) | ( FreeInputFieldAnswer ) | ( OptionFieldAnswer ) | ( WebhookFieldAnswer );
  GroupType: ( DiscordRoleGroup ) | ( GroupCustom ) | ( GroupNft ) | ( GroupTelegramChat );
  IdentityType: ( IdentityBlockchain ) | ( IdentityDiscord ) | ( IdentityEmail ) | ( IdentityTelegram );
  ResultConfig: ( Decision ) | ( LlmSummary ) | ( LlmSummaryList ) | ( Ranking );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Action: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Action']>;
  ActionArgs: ActionArgs;
  ActionExecution: ResolverTypeWrapper<ActionExecution>;
  ActionType: ActionType;
  AlchemyApiNftContract: ResolverTypeWrapper<AlchemyApiNftContract>;
  AlchemyApiNftToken: ResolverTypeWrapper<AlchemyApiNftToken>;
  ApiHatToken: ResolverTypeWrapper<ApiHatToken>;
  Blockchain: Blockchain;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CallWebhook: ResolverTypeWrapper<CallWebhook>;
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  Decision: ResolverTypeWrapper<Decision>;
  DecisionArgs: DecisionArgs;
  DecisionType: DecisionType;
  DiscordAPIServerRole: ResolverTypeWrapper<DiscordApiServerRole>;
  DiscordRoleGroup: ResolverTypeWrapper<DiscordRoleGroup>;
  DiscordServer: ResolverTypeWrapper<DiscordServer>;
  DiscordServerOnboarded: ResolverTypeWrapper<DiscordServerOnboarded>;
  EntitiesFieldAnswer: ResolverTypeWrapper<Omit<EntitiesFieldAnswer, 'entities'> & { entities: Array<ResolversTypes['Entity']> }>;
  Entity: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Entity']>;
  EntityArgs: EntityArgs;
  EntityType: EntityType;
  EvolveFlow: ResolverTypeWrapper<EvolveFlow>;
  EvolveFlowArgs: EvolveFlowArgs;
  EvolveGroup: ResolverTypeWrapper<EvolveGroup>;
  Field: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Field']>;
  FieldAnswer: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['FieldAnswer']>;
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldDataType: FieldDataType;
  FieldOptionArgs: FieldOptionArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  FieldOptionsSelectionType: FieldOptionsSelectionType;
  FieldType: FieldType;
  Flow: ResolverTypeWrapper<Omit<Flow, 'evolve' | 'flowsEvolvedByThisFlow' | 'group' | 'steps'> & { evolve?: Maybe<ResolversTypes['Flow']>, flowsEvolvedByThisFlow: Array<ResolversTypes['FlowReference']>, group?: Maybe<ResolversTypes['Group']>, steps: Array<ResolversTypes['Step']> }>;
  FlowReference: ResolverTypeWrapper<FlowReference>;
  FlowSummary: ResolverTypeWrapper<Omit<FlowSummary, 'creator' | 'group' | 'requestStep0Permission'> & { creator: ResolversTypes['User'], group?: Maybe<ResolversTypes['Group']>, requestStep0Permission: ResolversTypes['Permission'] }>;
  FlowTriggerPermissionFilter: FlowTriggerPermissionFilter;
  FlowType: FlowType;
  FlowsFieldAnswer: ResolverTypeWrapper<Omit<FlowsFieldAnswer, 'flows'> & { flows: Array<ResolversTypes['FlowSummary']> }>;
  FreeInput: ResolverTypeWrapper<Omit<FreeInput, 'defaultAnswer'> & { defaultAnswer?: Maybe<ResolversTypes['FieldAnswer']> }>;
  FreeInputFieldAnswer: ResolverTypeWrapper<FreeInputFieldAnswer>;
  GenericFieldAndValue: ResolverTypeWrapper<GenericFieldAndValue>;
  Group: ResolverTypeWrapper<Omit<Group, 'creator' | 'groupType'> & { creator?: Maybe<ResolversTypes['User']>, groupType: ResolversTypes['GroupType'] }>;
  GroupCustom: ResolverTypeWrapper<GroupCustom>;
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupFlowArgs: GroupFlowArgs;
  GroupFlowPolicyArgs: GroupFlowPolicyArgs;
  GroupFlowPolicyType: GroupFlowPolicyType;
  GroupHatArgs: GroupHatArgs;
  GroupNft: ResolverTypeWrapper<GroupNft>;
  GroupNftArgs: GroupNftArgs;
  GroupTelegramChat: ResolverTypeWrapper<GroupTelegramChat>;
  GroupType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GroupType']>;
  GroupWatchFlow: ResolverTypeWrapper<GroupWatchFlow>;
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
  LinkedResultOptionsArgs: LinkedResultOptionsArgs;
  LlmSummary: ResolverTypeWrapper<LlmSummary>;
  LlmSummaryArgs: LlmSummaryArgs;
  LlmSummaryList: ResolverTypeWrapper<LlmSummaryList>;
  LlmSummaryType: LlmSummaryType;
  Me: ResolverTypeWrapper<Omit<Me, 'groups' | 'identities' | 'user'> & { groups: Array<ResolversTypes['Group']>, identities: Array<ResolversTypes['Identity']>, user: ResolversTypes['User'] }>;
  Mutation: ResolverTypeWrapper<{}>;
  NewEntityArgs: NewEntityArgs;
  NewEntityTypes: NewEntityTypes;
  NewEvolveRequestArgs: NewEvolveRequestArgs;
  NewFlowArgs: NewFlowArgs;
  NewRequestArgs: NewRequestArgs;
  NewResponseArgs: NewResponseArgs;
  NewStepArgs: NewStepArgs;
  NftCollection: ResolverTypeWrapper<NftCollection>;
  NftTypes: NftTypes;
  OnboardedDiscordServer: ResolverTypeWrapper<OnboardedDiscordServer>;
  Option: ResolverTypeWrapper<Option>;
  OptionFieldAnswer: ResolverTypeWrapper<OptionFieldAnswer>;
  OptionFieldAnswerSelection: ResolverTypeWrapper<OptionFieldAnswerSelection>;
  OptionSelectionArgs: OptionSelectionArgs;
  Options: ResolverTypeWrapper<Options>;
  Organization: ResolverTypeWrapper<Organization>;
  Permission: ResolverTypeWrapper<Omit<Permission, 'entities'> & { entities: Array<ResolversTypes['Entity']> }>;
  PermissionArgs: PermissionArgs;
  PrioritizationArgs: PrioritizationArgs;
  Query: ResolverTypeWrapper<{}>;
  Ranking: ResolverTypeWrapper<Ranking>;
  Request: ResolverTypeWrapper<Omit<Request, 'creator' | 'flow' | 'steps'> & { creator: ResolversTypes['User'], flow: ResolversTypes['Flow'], steps: Array<ResolversTypes['RequestStep']> }>;
  RequestConfig: ResolverTypeWrapper<Omit<RequestConfig, 'fields' | 'permission'> & { fields: Array<ResolversTypes['Field']>, permission?: Maybe<ResolversTypes['Permission']> }>;
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: ResolverTypeWrapper<Omit<RequestStep, 'actionExecution' | 'requestFieldAnswers' | 'responseFieldAnswers' | 'responseFields' | 'userResponses'> & { actionExecution?: Maybe<ResolversTypes['ActionExecution']>, requestFieldAnswers: Array<ResolversTypes['FieldAnswer']>, responseFieldAnswers: Array<ResolversTypes['UserFieldAnswers']>, responseFields: Array<ResolversTypes['Field']>, userResponses: Array<ResolversTypes['Response']> }>;
  RequestStepRespondPermissionFilter: RequestStepRespondPermissionFilter;
  RequestStepStatusFilter: RequestStepStatusFilter;
  RequestStepSummary: ResolverTypeWrapper<Omit<RequestStepSummary, 'creator' | 'respondPermission'> & { creator: ResolversTypes['User'], respondPermission?: Maybe<ResolversTypes['Permission']> }>;
  Response: ResolverTypeWrapper<Omit<Response, 'answers' | 'user'> & { answers: Array<ResolversTypes['FieldAnswer']>, user: ResolversTypes['User'] }>;
  ResponseConfig: ResolverTypeWrapper<Omit<ResponseConfig, 'fields' | 'permission'> & { fields: Array<ResolversTypes['Field']>, permission?: Maybe<ResolversTypes['Permission']> }>;
  Result: ResolverTypeWrapper<Result>;
  ResultArgs: ResultArgs;
  ResultConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ResultConfig']>;
  ResultItem: ResolverTypeWrapper<ResultItem>;
  ResultType: ResultType;
  Status: Status;
  Step: ResolverTypeWrapper<Omit<Step, 'action' | 'request' | 'response' | 'result'> & { action?: Maybe<ResolversTypes['Action']>, request: ResolversTypes['RequestConfig'], response: ResolversTypes['ResponseConfig'], result: Array<ResolversTypes['ResultConfig']> }>;
  StepRequestArgs: StepRequestArgs;
  StepResponseArgs: StepResponseArgs;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TestWebhookArgs: TestWebhookArgs;
  TriggerStep: ResolverTypeWrapper<TriggerStep>;
  UpdateProfileArgs: UpdateProfileArgs;
  User: ResolverTypeWrapper<User>;
  UserFieldAnswer: ResolverTypeWrapper<Omit<UserFieldAnswer, 'answer' | 'user'> & { answer: ResolversTypes['FieldAnswer'], user: ResolversTypes['User'] }>;
  UserFieldAnswers: ResolverTypeWrapper<Omit<UserFieldAnswers, 'answers'> & { answers: Array<ResolversTypes['UserFieldAnswer']> }>;
  UserFlowPermission: ResolverTypeWrapper<UserFlowPermission>;
  UserPermission: ResolverTypeWrapper<UserPermission>;
  WatchFilter: WatchFilter;
  WebhookFieldAnswer: ResolverTypeWrapper<WebhookFieldAnswer>;
  WebhookPayload: ResolverTypeWrapper<WebhookPayload>;
  WebhookValue: ResolverTypeWrapper<WebhookValue>;
  WebhookValueArgs: WebhookValueArgs;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Action: ResolversUnionTypes<ResolversParentTypes>['Action'];
  ActionArgs: ActionArgs;
  ActionExecution: ActionExecution;
  AlchemyApiNftContract: AlchemyApiNftContract;
  AlchemyApiNftToken: AlchemyApiNftToken;
  ApiHatToken: ApiHatToken;
  Boolean: Scalars['Boolean']['output'];
  CallWebhook: CallWebhook;
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  Decision: Decision;
  DecisionArgs: DecisionArgs;
  DiscordAPIServerRole: DiscordApiServerRole;
  DiscordRoleGroup: DiscordRoleGroup;
  DiscordServer: DiscordServer;
  DiscordServerOnboarded: DiscordServerOnboarded;
  EntitiesFieldAnswer: Omit<EntitiesFieldAnswer, 'entities'> & { entities: Array<ResolversParentTypes['Entity']> };
  Entity: ResolversUnionTypes<ResolversParentTypes>['Entity'];
  EntityArgs: EntityArgs;
  EvolveFlow: EvolveFlow;
  EvolveFlowArgs: EvolveFlowArgs;
  EvolveGroup: EvolveGroup;
  Field: ResolversUnionTypes<ResolversParentTypes>['Field'];
  FieldAnswer: ResolversUnionTypes<ResolversParentTypes>['FieldAnswer'];
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldOptionArgs: FieldOptionArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  Flow: Omit<Flow, 'evolve' | 'flowsEvolvedByThisFlow' | 'group' | 'steps'> & { evolve?: Maybe<ResolversParentTypes['Flow']>, flowsEvolvedByThisFlow: Array<ResolversParentTypes['FlowReference']>, group?: Maybe<ResolversParentTypes['Group']>, steps: Array<ResolversParentTypes['Step']> };
  FlowReference: FlowReference;
  FlowSummary: Omit<FlowSummary, 'creator' | 'group' | 'requestStep0Permission'> & { creator: ResolversParentTypes['User'], group?: Maybe<ResolversParentTypes['Group']>, requestStep0Permission: ResolversParentTypes['Permission'] };
  FlowsFieldAnswer: Omit<FlowsFieldAnswer, 'flows'> & { flows: Array<ResolversParentTypes['FlowSummary']> };
  FreeInput: Omit<FreeInput, 'defaultAnswer'> & { defaultAnswer?: Maybe<ResolversParentTypes['FieldAnswer']> };
  FreeInputFieldAnswer: FreeInputFieldAnswer;
  GenericFieldAndValue: GenericFieldAndValue;
  Group: Omit<Group, 'creator' | 'groupType'> & { creator?: Maybe<ResolversParentTypes['User']>, groupType: ResolversParentTypes['GroupType'] };
  GroupCustom: GroupCustom;
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupFlowArgs: GroupFlowArgs;
  GroupFlowPolicyArgs: GroupFlowPolicyArgs;
  GroupHatArgs: GroupHatArgs;
  GroupNft: GroupNft;
  GroupNftArgs: GroupNftArgs;
  GroupTelegramChat: GroupTelegramChat;
  GroupType: ResolversUnionTypes<ResolversParentTypes>['GroupType'];
  GroupWatchFlow: GroupWatchFlow;
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
  LinkedResultOptionsArgs: LinkedResultOptionsArgs;
  LlmSummary: LlmSummary;
  LlmSummaryArgs: LlmSummaryArgs;
  LlmSummaryList: LlmSummaryList;
  Me: Omit<Me, 'groups' | 'identities' | 'user'> & { groups: Array<ResolversParentTypes['Group']>, identities: Array<ResolversParentTypes['Identity']>, user: ResolversParentTypes['User'] };
  Mutation: {};
  NewEntityArgs: NewEntityArgs;
  NewEvolveRequestArgs: NewEvolveRequestArgs;
  NewFlowArgs: NewFlowArgs;
  NewRequestArgs: NewRequestArgs;
  NewResponseArgs: NewResponseArgs;
  NewStepArgs: NewStepArgs;
  NftCollection: NftCollection;
  OnboardedDiscordServer: OnboardedDiscordServer;
  Option: Option;
  OptionFieldAnswer: OptionFieldAnswer;
  OptionFieldAnswerSelection: OptionFieldAnswerSelection;
  OptionSelectionArgs: OptionSelectionArgs;
  Options: Options;
  Organization: Organization;
  Permission: Omit<Permission, 'entities'> & { entities: Array<ResolversParentTypes['Entity']> };
  PermissionArgs: PermissionArgs;
  PrioritizationArgs: PrioritizationArgs;
  Query: {};
  Ranking: Ranking;
  Request: Omit<Request, 'creator' | 'flow' | 'steps'> & { creator: ResolversParentTypes['User'], flow: ResolversParentTypes['Flow'], steps: Array<ResolversParentTypes['RequestStep']> };
  RequestConfig: Omit<RequestConfig, 'fields' | 'permission'> & { fields: Array<ResolversParentTypes['Field']>, permission?: Maybe<ResolversParentTypes['Permission']> };
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: Omit<RequestStep, 'actionExecution' | 'requestFieldAnswers' | 'responseFieldAnswers' | 'responseFields' | 'userResponses'> & { actionExecution?: Maybe<ResolversParentTypes['ActionExecution']>, requestFieldAnswers: Array<ResolversParentTypes['FieldAnswer']>, responseFieldAnswers: Array<ResolversParentTypes['UserFieldAnswers']>, responseFields: Array<ResolversParentTypes['Field']>, userResponses: Array<ResolversParentTypes['Response']> };
  RequestStepSummary: Omit<RequestStepSummary, 'creator' | 'respondPermission'> & { creator: ResolversParentTypes['User'], respondPermission?: Maybe<ResolversParentTypes['Permission']> };
  Response: Omit<Response, 'answers' | 'user'> & { answers: Array<ResolversParentTypes['FieldAnswer']>, user: ResolversParentTypes['User'] };
  ResponseConfig: Omit<ResponseConfig, 'fields' | 'permission'> & { fields: Array<ResolversParentTypes['Field']>, permission?: Maybe<ResolversParentTypes['Permission']> };
  Result: Result;
  ResultArgs: ResultArgs;
  ResultConfig: ResolversUnionTypes<ResolversParentTypes>['ResultConfig'];
  ResultItem: ResultItem;
  Step: Omit<Step, 'action' | 'request' | 'response' | 'result'> & { action?: Maybe<ResolversParentTypes['Action']>, request: ResolversParentTypes['RequestConfig'], response: ResolversParentTypes['ResponseConfig'], result: Array<ResolversParentTypes['ResultConfig']> };
  StepRequestArgs: StepRequestArgs;
  StepResponseArgs: StepResponseArgs;
  String: Scalars['String']['output'];
  TestWebhookArgs: TestWebhookArgs;
  TriggerStep: TriggerStep;
  UpdateProfileArgs: UpdateProfileArgs;
  User: User;
  UserFieldAnswer: Omit<UserFieldAnswer, 'answer' | 'user'> & { answer: ResolversParentTypes['FieldAnswer'], user: ResolversParentTypes['User'] };
  UserFieldAnswers: Omit<UserFieldAnswers, 'answers'> & { answers: Array<ResolversParentTypes['UserFieldAnswer']> };
  UserFlowPermission: UserFlowPermission;
  UserPermission: UserPermission;
  WebhookFieldAnswer: WebhookFieldAnswer;
  WebhookPayload: WebhookPayload;
  WebhookValue: WebhookValue;
  WebhookValueArgs: WebhookValueArgs;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

export type ActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = {
  __resolveType: TypeResolveFn<'CallWebhook' | 'EvolveFlow' | 'EvolveGroup' | 'GroupWatchFlow' | 'TriggerStep', ParentType, ContextType>;
};

export type ActionExecutionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ActionExecution'] = ResolversParentTypes['ActionExecution']> = {
  actionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastAttemptedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
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
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webhookId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DecisionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Decision'] = ResolversParentTypes['Decision']> = {
  decisionType?: Resolver<ResolversTypes['DecisionType'], ParentType, ContextType>;
  defaultOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type DiscordServerOnboardedResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DiscordServerOnboarded'] = ResolversParentTypes['DiscordServerOnboarded']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EntitiesFieldAnswer'] = ResolversParentTypes['EntitiesFieldAnswer']> = {
  entities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  __resolveType: TypeResolveFn<'Group' | 'Identity', ParentType, ContextType>;
};

export type EvolveFlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveFlow'] = ResolversParentTypes['EvolveFlow']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EvolveGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveGroup'] = ResolversParentTypes['EvolveGroup']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = {
  __resolveType: TypeResolveFn<'FreeInput' | 'Options', ParentType, ContextType>;
};

export type FieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FieldAnswer'] = ResolversParentTypes['FieldAnswer']> = {
  __resolveType: TypeResolveFn<'EntitiesFieldAnswer' | 'FlowsFieldAnswer' | 'FreeInputFieldAnswer' | 'OptionFieldAnswer' | 'WebhookFieldAnswer', ParentType, ContextType>;
};

export type FlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Flow'] = ResolversParentTypes['Flow']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentFlowVersionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evolve?: Resolver<Maybe<ResolversTypes['Flow']>, ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowVersionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowsEvolvedByThisFlow?: Resolver<Array<ResolversTypes['FlowReference']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isWatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reusable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  steps?: Resolver<Array<ResolversTypes['Step']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FlowType'], ParentType, ContextType>;
  versionCreatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  versionPublishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowReferenceResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowReference'] = ResolversParentTypes['FlowReference']> = {
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowSummary'] = ResolversParentTypes['FlowSummary']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  isWatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestStep0Permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['UserFlowPermission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowsFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowsFieldAnswer'] = ResolversParentTypes['FlowsFieldAnswer']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flows?: Resolver<Array<ResolversTypes['FlowSummary']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FreeInputResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FreeInput'] = ResolversParentTypes['FreeInput']> = {
  dataType?: Resolver<ResolversTypes['FieldDataType'], ParentType, ContextType>;
  defaultAnswer?: Resolver<Maybe<ResolversTypes['FieldAnswer']>, ParentType, ContextType>;
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FreeInputFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FreeInputFieldAnswer'] = ResolversParentTypes['FreeInputFieldAnswer']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenericFieldAndValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GenericFieldAndValue'] = ResolversParentTypes['GenericFieldAndValue']> = {
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
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

export type GroupCustomResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupCustom'] = ResolversParentTypes['GroupCustom']> = {
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
  __resolveType: TypeResolveFn<'DiscordRoleGroup' | 'GroupCustom' | 'GroupNft' | 'GroupTelegramChat', ParentType, ContextType>;
};

export type GroupWatchFlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupWatchFlow'] = ResolversParentTypes['GroupWatchFlow']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityEmailResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityEmail'] = ResolversParentTypes['IdentityEmail']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityTelegramResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityTelegram'] = ResolversParentTypes['IdentityTelegram']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  telegramUserId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  telegramUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityType'] = ResolversParentTypes['IdentityType']> = {
  __resolveType: TypeResolveFn<'IdentityBlockchain' | 'IdentityDiscord' | 'IdentityEmail' | 'IdentityTelegram', ParentType, ContextType>;
};

export type IzeGroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IzeGroup'] = ResolversParentTypes['IzeGroup']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  notificationEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkedResultResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LinkedResult'] = ResolversParentTypes['LinkedResult']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultType?: Resolver<ResolversTypes['ResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LlmSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LlmSummary'] = ResolversParentTypes['LlmSummary']> = {
  example?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LlmSummaryListResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LlmSummaryList'] = ResolversParentTypes['LlmSummaryList']> = {
  example?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  discordServers?: Resolver<Array<ResolversTypes['DiscordServer']>, ParentType, ContextType>;
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  identities?: Resolver<Array<ResolversTypes['Identity']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createWebhook?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateWebhookArgs, 'inputs'>>;
  newCustomGroup?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewCustomGroupArgs, 'inputs'>>;
  newEntities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationNewEntitiesArgs, 'entities'>>;
  newEvolveRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewEvolveRequestArgs, 'request'>>;
  newFlow?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewFlowArgs, 'flow'>>;
  newRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewRequestArgs, 'request'>>;
  newResponse?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewResponseArgs, 'response'>>;
  testNotificationWebhook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTestNotificationWebhookArgs, 'uri'>>;
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
  dataType?: Resolver<ResolversTypes['FieldDataType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionFieldAnswer'] = ResolversParentTypes['OptionFieldAnswer']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  selections?: Resolver<Array<ResolversTypes['OptionFieldAnswerSelection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionFieldAnswerSelectionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['OptionFieldAnswerSelection'] = ResolversParentTypes['OptionFieldAnswerSelection']> = {
  optionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OptionsResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Options'] = ResolversParentTypes['Options']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  linkedResultOptions?: Resolver<Array<ResolversTypes['LinkedResult']>, ParentType, ContextType>;
  maxSelections?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['Option']>, ParentType, ContextType>;
  previousStepOptions?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  requestOptionsDataType?: Resolver<Maybe<ResolversTypes['FieldDataType']>, ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  selectionType?: Resolver<ResolversTypes['FieldOptionsSelectionType'], ParentType, ContextType>;
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
  stepTriggered?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  discordServerRoles?: Resolver<Array<ResolversTypes['DiscordAPIServerRole']>, ParentType, ContextType, RequireFields<QueryDiscordServerRolesArgs, 'serverId'>>;
  getFlow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType, Partial<QueryGetFlowArgs>>;
  getFlows?: Resolver<Array<ResolversTypes['FlowSummary']>, ParentType, ContextType, RequireFields<QueryGetFlowsArgs, 'limit' | 'searchQuery' | 'triggerPermissionFilter' | 'watchFilter'>>;
  getRequest?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<QueryGetRequestArgs, 'requestId'>>;
  getRequestSteps?: Resolver<Array<ResolversTypes['RequestStepSummary']>, ParentType, ContextType, RequireFields<QueryGetRequestStepsArgs, 'limit' | 'respondPermissionFilter' | 'searchQuery' | 'statusFilter' | 'userOnly'>>;
  group?: Resolver<ResolversTypes['IzeGroup'], ParentType, ContextType, RequireFields<QueryGroupArgs, 'id'>>;
  groupsForCurrentUser?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGroupsForCurrentUserArgs, 'limit' | 'searchQuery' | 'watchFilter'>>;
  hatToken?: Resolver<Maybe<ResolversTypes['ApiHatToken']>, ParentType, ContextType, RequireFields<QueryHatTokenArgs, 'chain' | 'tokenId'>>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QueryNftContractArgs, 'address' | 'chain'>>;
  nftToken?: Resolver<Maybe<ResolversTypes['AlchemyApiNftToken']>, ParentType, ContextType, RequireFields<QueryNftTokenArgs, 'address' | 'chain' | 'tokenId'>>;
  searchNftContracts?: Resolver<Array<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QuerySearchNftContractsArgs, 'chain' | 'query'>>;
  telegramChats?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
};

export type RankingResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Ranking'] = ResolversParentTypes['Ranking']> = {
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numOptionsToInclude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Request'] = ResolversParentTypes['Request']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  currentStepIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  flow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  steps?: Resolver<Array<ResolversTypes['RequestStep']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestConfig'] = ResolversParentTypes['RequestConfig']> = {
  fields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  fieldsLocked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  permission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStep'] = ResolversParentTypes['RequestStep']> = {
  actionExecution?: Resolver<Maybe<ResolversTypes['ActionExecution']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  requestFieldAnswers?: Resolver<Array<ResolversTypes['FieldAnswer']>, ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responseComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  responseFieldAnswers?: Resolver<Array<ResolversTypes['UserFieldAnswers']>, ParentType, ContextType>;
  responseFields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>;
  resultsComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userResponses?: Resolver<Array<ResolversTypes['Response']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStepSummary'] = ResolversParentTypes['RequestStepSummary']> = {
  actionsComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  respondPermission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  responseComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resultsComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  stepIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSteps?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userRespondPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userResponded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  answers?: Resolver<Array<ResolversTypes['FieldAnswer']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseConfig'] = ResolversParentTypes['ResponseConfig']> = {
  fields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  fieldsLocked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  permission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasResult?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resultItems?: Resolver<Array<ResolversTypes['ResultItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultConfig'] = ResolversParentTypes['ResultConfig']> = {
  __resolveType: TypeResolveFn<'Decision' | 'LlmSummary' | 'LlmSummaryList' | 'Ranking', ParentType, ContextType>;
};

export type ResultItemResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultItem'] = ResolversParentTypes['ResultItem']> = {
  dataType?: Resolver<ResolversTypes['FieldDataType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Step'] = ResolversParentTypes['Step']> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  allowMultipleResponses?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expirationSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  request?: Resolver<ResolversTypes['RequestConfig'], ParentType, ContextType>;
  response?: Resolver<ResolversTypes['ResponseConfig'], ParentType, ContextType>;
  result?: Resolver<Array<ResolversTypes['ResultConfig']>, ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerStep'] = ResolversParentTypes['TriggerStep']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserFieldAnswer'] = ResolversParentTypes['UserFieldAnswer']> = {
  answer?: Resolver<ResolversTypes['FieldAnswer'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFieldAnswersResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserFieldAnswers'] = ResolversParentTypes['UserFieldAnswers']> = {
  answers?: Resolver<Array<ResolversTypes['UserFieldAnswer']>, ParentType, ContextType>;
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFlowPermissionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserFlowPermission'] = ResolversParentTypes['UserFlowPermission']> = {
  request?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserPermission'] = ResolversParentTypes['UserPermission']> = {
  request?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  response?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebhookFieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['WebhookFieldAnswer'] = ResolversParentTypes['WebhookFieldAnswer']> = {
  fieldId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originalUri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webhookId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebhookPayloadResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['WebhookPayload'] = ResolversParentTypes['WebhookPayload']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestFields?: Resolver<Array<ResolversTypes['WebhookValue']>, ParentType, ContextType>;
  requestName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['WebhookValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebhookValueResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['WebhookValue'] = ResolversParentTypes['WebhookValue']> = {
  fieldName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionSelections?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphqlRequestContext> = {
  Action?: ActionResolvers<ContextType>;
  ActionExecution?: ActionExecutionResolvers<ContextType>;
  AlchemyApiNftContract?: AlchemyApiNftContractResolvers<ContextType>;
  AlchemyApiNftToken?: AlchemyApiNftTokenResolvers<ContextType>;
  ApiHatToken?: ApiHatTokenResolvers<ContextType>;
  CallWebhook?: CallWebhookResolvers<ContextType>;
  Decision?: DecisionResolvers<ContextType>;
  DiscordAPIServerRole?: DiscordApiServerRoleResolvers<ContextType>;
  DiscordRoleGroup?: DiscordRoleGroupResolvers<ContextType>;
  DiscordServer?: DiscordServerResolvers<ContextType>;
  DiscordServerOnboarded?: DiscordServerOnboardedResolvers<ContextType>;
  EntitiesFieldAnswer?: EntitiesFieldAnswerResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EvolveFlow?: EvolveFlowResolvers<ContextType>;
  EvolveGroup?: EvolveGroupResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
  FieldAnswer?: FieldAnswerResolvers<ContextType>;
  Flow?: FlowResolvers<ContextType>;
  FlowReference?: FlowReferenceResolvers<ContextType>;
  FlowSummary?: FlowSummaryResolvers<ContextType>;
  FlowsFieldAnswer?: FlowsFieldAnswerResolvers<ContextType>;
  FreeInput?: FreeInputResolvers<ContextType>;
  FreeInputFieldAnswer?: FreeInputFieldAnswerResolvers<ContextType>;
  GenericFieldAndValue?: GenericFieldAndValueResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupCustom?: GroupCustomResolvers<ContextType>;
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
  LlmSummaryList?: LlmSummaryListResolvers<ContextType>;
  Me?: MeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NftCollection?: NftCollectionResolvers<ContextType>;
  OnboardedDiscordServer?: OnboardedDiscordServerResolvers<ContextType>;
  Option?: OptionResolvers<ContextType>;
  OptionFieldAnswer?: OptionFieldAnswerResolvers<ContextType>;
  OptionFieldAnswerSelection?: OptionFieldAnswerSelectionResolvers<ContextType>;
  Options?: OptionsResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Ranking?: RankingResolvers<ContextType>;
  Request?: RequestResolvers<ContextType>;
  RequestConfig?: RequestConfigResolvers<ContextType>;
  RequestStep?: RequestStepResolvers<ContextType>;
  RequestStepSummary?: RequestStepSummaryResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  ResponseConfig?: ResponseConfigResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  ResultConfig?: ResultConfigResolvers<ContextType>;
  ResultItem?: ResultItemResolvers<ContextType>;
  Step?: StepResolvers<ContextType>;
  TriggerStep?: TriggerStepResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserFieldAnswer?: UserFieldAnswerResolvers<ContextType>;
  UserFieldAnswers?: UserFieldAnswersResolvers<ContextType>;
  UserFlowPermission?: UserFlowPermissionResolvers<ContextType>;
  UserPermission?: UserPermissionResolvers<ContextType>;
  WebhookFieldAnswer?: WebhookFieldAnswerResolvers<ContextType>;
  WebhookPayload?: WebhookPayloadResolvers<ContextType>;
  WebhookValue?: WebhookValueResolvers<ContextType>;
};

