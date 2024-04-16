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

export type Action = CallWebhook | EvolveFlow | TriggerStep;

export type ActionArgs = {
  callWebhook?: InputMaybe<CallWebhookArgs>;
  filterOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  filterResponseFieldIndex?: InputMaybe<Scalars['Int']['input']>;
  type: ActionType;
};

export enum ActionType {
  CallWebhook = 'CallWebhook',
  EvolveFlow = 'EvolveFlow',
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
  name: Scalars['String']['output'];
  uri: Scalars['String']['output'];
};

export type CallWebhookArgs = {
  name: Scalars['String']['input'];
  uri: Scalars['String']['input'];
};

export type CustomGroupArgs = {
  members: Array<CustomGroupMembersArgs>;
  name: Scalars['String']['input'];
};

export type CustomGroupMembersArgs = {
  entityType: EntityType;
  id: Scalars['String']['input'];
};

export type Decision = {
  __typename?: 'Decision';
  decisionType: DecisionType;
  defaultOption?: Maybe<Option>;
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  resultConfigId: Scalars['String']['output'];
  threshold: Scalars['Int']['output'];
};

export type DecisionArgs = {
  defaultOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  threshold: Scalars['Int']['input'];
  type: DecisionType;
};

export enum DecisionType {
  NumberThreshold = 'NumberThreshold',
  PercentageThreshold = 'PercentageThreshold'
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
};

export type EvolveFlowArgs = {
  decision: DecisionArgs;
  requestPermission: PermissionArgs;
  responsePermission: PermissionArgs;
};

export type Field = FreeInput | Options;

export type FieldAnswer = FreeInputFieldAnswer | OptionFieldAnswer;

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
  Number = 'Number',
  String = 'String',
  Uri = 'Uri'
}

export type FieldOptionArgs = {
  dataType: FieldDataType;
  name: Scalars['String']['input'];
  optionId?: InputMaybe<Scalars['String']['input']>;
};

export type FieldOptionsConfigArgs = {
  hasRequestOptions: Scalars['Boolean']['input'];
  linkedResultOptions: Array<LinkedResultOptionsArgs>;
  maxSelections: Scalars['Int']['input'];
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
  evolve?: Maybe<Flow>;
  flowId: Scalars['String']['output'];
  flowVersionId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reusable: Scalars['Boolean']['output'];
  steps: Array<Maybe<Step>>;
  type: FlowType;
};

export type FlowSummary = {
  __typename?: 'FlowSummary';
  createdAt: Scalars['String']['output'];
  creator: User;
  flowId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  requestStep0Permission: Permission;
  userPermission: UserFlowPermission;
};

export enum FlowType {
  Custom = 'Custom',
  Evolve = 'Evolve'
}

export type FreeInput = {
  __typename?: 'FreeInput';
  dataType: FieldDataType;
  fieldId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type FreeInputFieldAnswer = {
  __typename?: 'FreeInputFieldAnswer';
  fieldId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  creator: User;
  entityId: Scalars['String']['output'];
  groupType: GroupType;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
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

export type GroupType = DiscordRoleGroup | GroupCustom | GroupNft;

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

export type IdentityType = IdentityBlockchain | IdentityDiscord | IdentityEmail;

export type LinkedResultOptionsArgs = {
  resultIndex: Scalars['Int']['input'];
  stepIndex: Scalars['Int']['input'];
};

export type LlmSummary = {
  __typename?: 'LlmSummary';
  fieldId?: Maybe<Scalars['String']['output']>;
  minimumAnswers: Scalars['Int']['output'];
  prompt?: Maybe<Scalars['String']['output']>;
  resultConfigId: Scalars['String']['output'];
};

export type LlmSummaryArgs = {
  prompt?: InputMaybe<Scalars['String']['input']>;
  type: LlmSummaryType;
};

export enum LlmSummaryType {
  AfterEveryResponse = 'AfterEveryResponse',
  AtTheEnd = 'AtTheEnd'
}

export type Me = {
  __typename?: 'Me';
  discordServers: Array<DiscordServer>;
  identities: Array<Identity>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  newCustomGroup: Scalars['String']['output'];
  newEntities: Array<Entity>;
  newFlow: Scalars['String']['output'];
  newRequest: Scalars['String']['output'];
  newResponse: Scalars['String']['output'];
};


export type MutationNewCustomGroupArgs = {
  inputs: CustomGroupArgs;
};


export type MutationNewEntitiesArgs = {
  entities: Array<NewEntityArgs>;
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
  IdentityBlockchain = 'IdentityBlockchain',
  IdentityDiscord = 'IdentityDiscord',
  IdentityEmail = 'IdentityEmail'
}

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
  action: ActionArgs;
  expirationSeconds?: InputMaybe<Scalars['Int']['input']>;
  request: StepRequestArgs;
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
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Options = {
  __typename?: 'Options';
  fieldId: Scalars['String']['output'];
  hasRequestOptions: Scalars['Boolean']['output'];
  linkedResultOptions: Array<Scalars['String']['output']>;
  maxSelections: Scalars['Int']['output'];
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
  numOptionsToInclude: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  getFlow: Flow;
  getFlows: Array<FlowSummary>;
  getRequest: Request;
  getRequestSteps: Array<RequestStepSummary>;
  group: Group;
  groupsForCurrentUser: Array<Group>;
  hatToken?: Maybe<ApiHatToken>;
  me?: Maybe<Me>;
  nftContract?: Maybe<AlchemyApiNftContract>;
  nftToken?: Maybe<AlchemyApiNftToken>;
  searchNftContracts: Array<AlchemyApiNftContract>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
};


export type QueryGetFlowArgs = {
  flowId: Scalars['String']['input'];
};


export type QueryGetRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['String']['input'];
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
  numOptionsToInclude: Scalars['Int']['output'];
  resultConfigId: Scalars['String']['output'];
};

export type Request = {
  __typename?: 'Request';
  createdAt: Scalars['String']['output'];
  currentStepIndex: Scalars['Int']['output'];
  flow: Flow;
  name: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  steps: Array<RequestStep>;
};

export type RequestConfig = {
  __typename?: 'RequestConfig';
  fields: Array<Field>;
  permission: Permission;
};

export type RequestDefinedOptionsArgs = {
  fieldId: Scalars['String']['input'];
  options: Array<FieldOptionArgs>;
};

export type RequestStep = {
  __typename?: 'RequestStep';
  createdAt: Scalars['String']['output'];
  expirationDate: Scalars['String']['output'];
  requestFieldAnswers: Array<FieldAnswer>;
  requestStepId: Scalars['String']['output'];
  responseFields: Array<Field>;
  responses: Array<Response>;
};

export type RequestStepSummary = {
  __typename?: 'RequestStepSummary';
  createdAt: Scalars['String']['output'];
  creator: User;
  expirationDate: Scalars['String']['output'];
  final: Scalars['Boolean']['output'];
  flowId: Scalars['String']['output'];
  flowName: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  requestName: Scalars['String']['output'];
  requestStepId: Scalars['String']['output'];
  respondPermission: Permission;
  stepIndex: Scalars['Int']['output'];
  totalSteps: Scalars['Int']['output'];
  userRespondPermission: Scalars['Boolean']['output'];
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
  permission: Permission;
};

export type ResultArgs = {
  decision?: InputMaybe<DecisionArgs>;
  fieldId?: InputMaybe<Scalars['String']['input']>;
  llmSummary?: InputMaybe<LlmSummaryArgs>;
  minimumAnswers?: InputMaybe<Scalars['Int']['input']>;
  prioritization?: InputMaybe<PrioritizationArgs>;
  responseFieldIndex?: InputMaybe<Scalars['Int']['input']>;
  resultId?: InputMaybe<Scalars['String']['input']>;
  type: ResultType;
};

export type ResultConfig = Decision | LlmSummary | Ranking;

export enum ResultType {
  Decision = 'Decision',
  LlmSummary = 'LlmSummary',
  Ranking = 'Ranking'
}

export type Step = {
  __typename?: 'Step';
  action?: Maybe<Action>;
  expirationSeconds?: Maybe<Scalars['Int']['output']>;
  index: Scalars['Int']['output'];
  request: RequestConfig;
  response: ResponseConfig;
  result: Array<ResultConfig>;
  userPermission: UserPermission;
};

export type StepRequestArgs = {
  fields: Array<FieldArgs>;
  permission: PermissionArgs;
};

export type StepResponseArgs = {
  fields: Array<FieldArgs>;
  permission: PermissionArgs;
};

export type TriggerStep = {
  __typename?: 'TriggerStep';
  filterOption?: Maybe<Option>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
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
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  Action: ( CallWebhook ) | ( EvolveFlow ) | ( TriggerStep );
  Entity: ( Omit<Group, 'groupType'> & { groupType: RefType['GroupType'] } ) | ( Omit<Identity, 'identityType'> & { identityType: RefType['IdentityType'] } );
  Field: ( FreeInput ) | ( Options );
  FieldAnswer: ( FreeInputFieldAnswer ) | ( OptionFieldAnswer );
  GroupType: ( DiscordRoleGroup ) | ( GroupCustom ) | ( GroupNft );
  IdentityType: ( IdentityBlockchain ) | ( IdentityDiscord ) | ( IdentityEmail );
  ResultConfig: ( Decision ) | ( LlmSummary ) | ( Ranking );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Action: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Action']>;
  ActionArgs: ActionArgs;
  ActionType: ActionType;
  AlchemyApiNftContract: ResolverTypeWrapper<AlchemyApiNftContract>;
  AlchemyApiNftToken: ResolverTypeWrapper<AlchemyApiNftToken>;
  ApiHatToken: ResolverTypeWrapper<ApiHatToken>;
  Blockchain: Blockchain;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CallWebhook: ResolverTypeWrapper<CallWebhook>;
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  CustomGroupMembersArgs: CustomGroupMembersArgs;
  Decision: ResolverTypeWrapper<Decision>;
  DecisionArgs: DecisionArgs;
  DecisionType: DecisionType;
  DiscordAPIServerRole: ResolverTypeWrapper<DiscordApiServerRole>;
  DiscordRoleGroup: ResolverTypeWrapper<DiscordRoleGroup>;
  DiscordServer: ResolverTypeWrapper<DiscordServer>;
  DiscordServerOnboarded: ResolverTypeWrapper<DiscordServerOnboarded>;
  Entity: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Entity']>;
  EntityArgs: EntityArgs;
  EntityType: EntityType;
  EvolveFlow: ResolverTypeWrapper<EvolveFlow>;
  EvolveFlowArgs: EvolveFlowArgs;
  Field: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Field']>;
  FieldAnswer: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['FieldAnswer']>;
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldDataType: FieldDataType;
  FieldOptionArgs: FieldOptionArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  FieldOptionsSelectionType: FieldOptionsSelectionType;
  FieldType: FieldType;
  Flow: ResolverTypeWrapper<Flow>;
  FlowSummary: ResolverTypeWrapper<FlowSummary>;
  FlowType: FlowType;
  FreeInput: ResolverTypeWrapper<FreeInput>;
  FreeInputFieldAnswer: ResolverTypeWrapper<FreeInputFieldAnswer>;
  Group: ResolverTypeWrapper<Omit<Group, 'groupType'> & { groupType: ResolversTypes['GroupType'] }>;
  GroupCustom: ResolverTypeWrapper<GroupCustom>;
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupHatArgs: GroupHatArgs;
  GroupNft: ResolverTypeWrapper<GroupNft>;
  GroupNftArgs: GroupNftArgs;
  GroupType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GroupType']>;
  Identity: ResolverTypeWrapper<Omit<Identity, 'identityType'> & { identityType: ResolversTypes['IdentityType'] }>;
  IdentityBlockchain: ResolverTypeWrapper<IdentityBlockchain>;
  IdentityBlockchainArgs: IdentityBlockchainArgs;
  IdentityDiscord: ResolverTypeWrapper<IdentityDiscord>;
  IdentityDiscordArgs: IdentityDiscordArgs;
  IdentityEmail: ResolverTypeWrapper<IdentityEmail>;
  IdentityEmailArgs: IdentityEmailArgs;
  IdentityType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['IdentityType']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LinkedResultOptionsArgs: LinkedResultOptionsArgs;
  LlmSummary: ResolverTypeWrapper<LlmSummary>;
  LlmSummaryArgs: LlmSummaryArgs;
  LlmSummaryType: LlmSummaryType;
  Me: ResolverTypeWrapper<Me>;
  Mutation: ResolverTypeWrapper<{}>;
  NewEntityArgs: NewEntityArgs;
  NewEntityTypes: NewEntityTypes;
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
  Request: ResolverTypeWrapper<Request>;
  RequestConfig: ResolverTypeWrapper<Omit<RequestConfig, 'fields'> & { fields: Array<ResolversTypes['Field']> }>;
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: ResolverTypeWrapper<Omit<RequestStep, 'requestFieldAnswers' | 'responseFields'> & { requestFieldAnswers: Array<ResolversTypes['FieldAnswer']>, responseFields: Array<ResolversTypes['Field']> }>;
  RequestStepSummary: ResolverTypeWrapper<RequestStepSummary>;
  Response: ResolverTypeWrapper<Omit<Response, 'answers'> & { answers: Array<ResolversTypes['FieldAnswer']> }>;
  ResponseConfig: ResolverTypeWrapper<Omit<ResponseConfig, 'fields'> & { fields: Array<ResolversTypes['Field']> }>;
  ResultArgs: ResultArgs;
  ResultConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ResultConfig']>;
  ResultType: ResultType;
  Step: ResolverTypeWrapper<Omit<Step, 'action' | 'result'> & { action?: Maybe<ResolversTypes['Action']>, result: Array<ResolversTypes['ResultConfig']> }>;
  StepRequestArgs: StepRequestArgs;
  StepResponseArgs: StepResponseArgs;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TriggerStep: ResolverTypeWrapper<TriggerStep>;
  User: ResolverTypeWrapper<User>;
  UserFlowPermission: ResolverTypeWrapper<UserFlowPermission>;
  UserPermission: ResolverTypeWrapper<UserPermission>;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Action: ResolversUnionTypes<ResolversParentTypes>['Action'];
  ActionArgs: ActionArgs;
  AlchemyApiNftContract: AlchemyApiNftContract;
  AlchemyApiNftToken: AlchemyApiNftToken;
  ApiHatToken: ApiHatToken;
  Boolean: Scalars['Boolean']['output'];
  CallWebhook: CallWebhook;
  CallWebhookArgs: CallWebhookArgs;
  CustomGroupArgs: CustomGroupArgs;
  CustomGroupMembersArgs: CustomGroupMembersArgs;
  Decision: Decision;
  DecisionArgs: DecisionArgs;
  DiscordAPIServerRole: DiscordApiServerRole;
  DiscordRoleGroup: DiscordRoleGroup;
  DiscordServer: DiscordServer;
  DiscordServerOnboarded: DiscordServerOnboarded;
  Entity: ResolversUnionTypes<ResolversParentTypes>['Entity'];
  EntityArgs: EntityArgs;
  EvolveFlow: EvolveFlow;
  EvolveFlowArgs: EvolveFlowArgs;
  Field: ResolversUnionTypes<ResolversParentTypes>['Field'];
  FieldAnswer: ResolversUnionTypes<ResolversParentTypes>['FieldAnswer'];
  FieldAnswerArgs: FieldAnswerArgs;
  FieldArgs: FieldArgs;
  FieldOptionArgs: FieldOptionArgs;
  FieldOptionsConfigArgs: FieldOptionsConfigArgs;
  Flow: Flow;
  FlowSummary: FlowSummary;
  FreeInput: FreeInput;
  FreeInputFieldAnswer: FreeInputFieldAnswer;
  Group: Omit<Group, 'groupType'> & { groupType: ResolversParentTypes['GroupType'] };
  GroupCustom: GroupCustom;
  GroupDiscordRoleArgs: GroupDiscordRoleArgs;
  GroupEnsArgs: GroupEnsArgs;
  GroupHatArgs: GroupHatArgs;
  GroupNft: GroupNft;
  GroupNftArgs: GroupNftArgs;
  GroupType: ResolversUnionTypes<ResolversParentTypes>['GroupType'];
  Identity: Omit<Identity, 'identityType'> & { identityType: ResolversParentTypes['IdentityType'] };
  IdentityBlockchain: IdentityBlockchain;
  IdentityBlockchainArgs: IdentityBlockchainArgs;
  IdentityDiscord: IdentityDiscord;
  IdentityDiscordArgs: IdentityDiscordArgs;
  IdentityEmail: IdentityEmail;
  IdentityEmailArgs: IdentityEmailArgs;
  IdentityType: ResolversUnionTypes<ResolversParentTypes>['IdentityType'];
  Int: Scalars['Int']['output'];
  LinkedResultOptionsArgs: LinkedResultOptionsArgs;
  LlmSummary: LlmSummary;
  LlmSummaryArgs: LlmSummaryArgs;
  Me: Me;
  Mutation: {};
  NewEntityArgs: NewEntityArgs;
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
  Request: Request;
  RequestConfig: Omit<RequestConfig, 'fields'> & { fields: Array<ResolversParentTypes['Field']> };
  RequestDefinedOptionsArgs: RequestDefinedOptionsArgs;
  RequestStep: Omit<RequestStep, 'requestFieldAnswers' | 'responseFields'> & { requestFieldAnswers: Array<ResolversParentTypes['FieldAnswer']>, responseFields: Array<ResolversParentTypes['Field']> };
  RequestStepSummary: RequestStepSummary;
  Response: Omit<Response, 'answers'> & { answers: Array<ResolversParentTypes['FieldAnswer']> };
  ResponseConfig: Omit<ResponseConfig, 'fields'> & { fields: Array<ResolversParentTypes['Field']> };
  ResultArgs: ResultArgs;
  ResultConfig: ResolversUnionTypes<ResolversParentTypes>['ResultConfig'];
  Step: Omit<Step, 'action' | 'result'> & { action?: Maybe<ResolversParentTypes['Action']>, result: Array<ResolversParentTypes['ResultConfig']> };
  StepRequestArgs: StepRequestArgs;
  StepResponseArgs: StepResponseArgs;
  String: Scalars['String']['output'];
  TriggerStep: TriggerStep;
  User: User;
  UserFlowPermission: UserFlowPermission;
  UserPermission: UserPermission;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

export type ActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = {
  __resolveType: TypeResolveFn<'CallWebhook' | 'EvolveFlow' | 'TriggerStep', ParentType, ContextType>;
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
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DecisionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Decision'] = ResolversParentTypes['Decision']> = {
  decisionType?: Resolver<ResolversTypes['DecisionType'], ParentType, ContextType>;
  defaultOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  threshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type EntityResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  __resolveType: TypeResolveFn<'Group' | 'Identity', ParentType, ContextType>;
};

export type EvolveFlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveFlow'] = ResolversParentTypes['EvolveFlow']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = {
  __resolveType: TypeResolveFn<'FreeInput' | 'Options', ParentType, ContextType>;
};

export type FieldAnswerResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FieldAnswer'] = ResolversParentTypes['FieldAnswer']> = {
  __resolveType: TypeResolveFn<'FreeInputFieldAnswer' | 'OptionFieldAnswer', ParentType, ContextType>;
};

export type FlowResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Flow'] = ResolversParentTypes['Flow']> = {
  evolve?: Resolver<Maybe<ResolversTypes['Flow']>, ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowVersionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reusable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  steps?: Resolver<Array<Maybe<ResolversTypes['Step']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FlowType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlowSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FlowSummary'] = ResolversParentTypes['FlowSummary']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestStep0Permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['UserFlowPermission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FreeInputResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['FreeInput'] = ResolversParentTypes['FreeInput']> = {
  dataType?: Resolver<ResolversTypes['FieldDataType'], ParentType, ContextType>;
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

export type GroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupType?: Resolver<ResolversTypes['GroupType'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type GroupTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupType'] = ResolversParentTypes['GroupType']> = {
  __resolveType: TypeResolveFn<'DiscordRoleGroup' | 'GroupCustom' | 'GroupNft', ParentType, ContextType>;
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

export type IdentityTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['IdentityType'] = ResolversParentTypes['IdentityType']> = {
  __resolveType: TypeResolveFn<'IdentityBlockchain' | 'IdentityDiscord' | 'IdentityEmail', ParentType, ContextType>;
};

export type LlmSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['LlmSummary'] = ResolversParentTypes['LlmSummary']> = {
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prompt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  discordServers?: Resolver<Array<ResolversTypes['DiscordServer']>, ParentType, ContextType>;
  identities?: Resolver<Array<ResolversTypes['Identity']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  newCustomGroup?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewCustomGroupArgs, 'inputs'>>;
  newEntities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationNewEntitiesArgs, 'entities'>>;
  newFlow?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewFlowArgs, 'flow'>>;
  newRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewRequestArgs, 'request'>>;
  newResponse?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewResponseArgs, 'response'>>;
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
  hasRequestOptions?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  linkedResultOptions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  maxSelections?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  getFlow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType, RequireFields<QueryGetFlowArgs, 'flowId'>>;
  getFlows?: Resolver<Array<ResolversTypes['FlowSummary']>, ParentType, ContextType>;
  getRequest?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<QueryGetRequestArgs, 'requestId'>>;
  getRequestSteps?: Resolver<Array<ResolversTypes['RequestStepSummary']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<QueryGroupArgs, 'id'>>;
  groupsForCurrentUser?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  hatToken?: Resolver<Maybe<ResolversTypes['ApiHatToken']>, ParentType, ContextType, RequireFields<QueryHatTokenArgs, 'chain' | 'tokenId'>>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QueryNftContractArgs, 'address' | 'chain'>>;
  nftToken?: Resolver<Maybe<ResolversTypes['AlchemyApiNftToken']>, ParentType, ContextType, RequireFields<QueryNftTokenArgs, 'address' | 'chain' | 'tokenId'>>;
  searchNftContracts?: Resolver<Array<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QuerySearchNftContractsArgs, 'chain' | 'query'>>;
};

export type RankingResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Ranking'] = ResolversParentTypes['Ranking']> = {
  fieldId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumAnswers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numOptionsToInclude?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  resultConfigId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Request'] = ResolversParentTypes['Request']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentStepIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flow?: Resolver<ResolversTypes['Flow'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  steps?: Resolver<Array<ResolversTypes['RequestStep']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestConfig'] = ResolversParentTypes['RequestConfig']> = {
  fields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStep'] = ResolversParentTypes['RequestStep']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestFieldAnswers?: Resolver<Array<ResolversTypes['FieldAnswer']>, ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responseFields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  responses?: Resolver<Array<ResolversTypes['Response']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestStepSummaryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestStepSummary'] = ResolversParentTypes['RequestStepSummary']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  final?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  flowId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flowName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestStepId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  respondPermission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  stepIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSteps?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userRespondPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultConfigResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResultConfig'] = ResolversParentTypes['ResultConfig']> = {
  __resolveType: TypeResolveFn<'Decision' | 'LlmSummary' | 'Ranking', ParentType, ContextType>;
};

export type StepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Step'] = ResolversParentTypes['Step']> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  expirationSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  request?: Resolver<ResolversTypes['RequestConfig'], ParentType, ContextType>;
  response?: Resolver<ResolversTypes['ResponseConfig'], ParentType, ContextType>;
  result?: Resolver<Array<ResolversTypes['ResultConfig']>, ParentType, ContextType>;
  userPermission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TriggerStepResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['TriggerStep'] = ResolversParentTypes['TriggerStep']> = {
  filterOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type Resolvers<ContextType = GraphqlRequestContext> = {
  Action?: ActionResolvers<ContextType>;
  AlchemyApiNftContract?: AlchemyApiNftContractResolvers<ContextType>;
  AlchemyApiNftToken?: AlchemyApiNftTokenResolvers<ContextType>;
  ApiHatToken?: ApiHatTokenResolvers<ContextType>;
  CallWebhook?: CallWebhookResolvers<ContextType>;
  Decision?: DecisionResolvers<ContextType>;
  DiscordAPIServerRole?: DiscordApiServerRoleResolvers<ContextType>;
  DiscordRoleGroup?: DiscordRoleGroupResolvers<ContextType>;
  DiscordServer?: DiscordServerResolvers<ContextType>;
  DiscordServerOnboarded?: DiscordServerOnboardedResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EvolveFlow?: EvolveFlowResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
  FieldAnswer?: FieldAnswerResolvers<ContextType>;
  Flow?: FlowResolvers<ContextType>;
  FlowSummary?: FlowSummaryResolvers<ContextType>;
  FreeInput?: FreeInputResolvers<ContextType>;
  FreeInputFieldAnswer?: FreeInputFieldAnswerResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupCustom?: GroupCustomResolvers<ContextType>;
  GroupNft?: GroupNftResolvers<ContextType>;
  GroupType?: GroupTypeResolvers<ContextType>;
  Identity?: IdentityResolvers<ContextType>;
  IdentityBlockchain?: IdentityBlockchainResolvers<ContextType>;
  IdentityDiscord?: IdentityDiscordResolvers<ContextType>;
  IdentityEmail?: IdentityEmailResolvers<ContextType>;
  IdentityType?: IdentityTypeResolvers<ContextType>;
  LlmSummary?: LlmSummaryResolvers<ContextType>;
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
  ResultConfig?: ResultConfigResolvers<ContextType>;
  Step?: StepResolvers<ContextType>;
  TriggerStep?: TriggerStepResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserFlowPermission?: UserFlowPermissionResolvers<ContextType>;
  UserPermission?: UserPermissionResolvers<ContextType>;
};

