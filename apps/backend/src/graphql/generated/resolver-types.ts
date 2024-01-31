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

export type AbsoluteDecision = {
  __typename?: 'AbsoluteDecision';
  threshold: Scalars['Int']['output'];
};

export type AbsoluteDecisionArgs = {
  threshold: Scalars['Int']['input'];
};

export type Action = {
  __typename?: 'Action';
  actionDetails?: Maybe<ActionType>;
  id: Scalars['String']['output'];
  optionFilter?: Maybe<ProcessOption>;
};

export type ActionArgs = {
  optionTrigger?: InputMaybe<Scalars['String']['input']>;
  webhook?: InputMaybe<WebhookActionArgs>;
};

export type ActionType = EvolveProcessAction | WebhookAction;

export type Agent = Group | Identity;

export enum AgentType {
  Group = 'Group',
  Identity = 'Identity'
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

export type DecisionArgs = {
  absoluteDecision?: InputMaybe<AbsoluteDecisionArgs>;
  expirationSeconds: Scalars['Int']['input'];
  percentageDecision?: InputMaybe<PercentageDecisionArgs>;
};

export type DecisionTypes = AbsoluteDecision | PercentageDecision;

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

export type EvolveArgs = {
  decision: DecisionArgs;
  roles: Array<RoleArgs>;
};

export type EvolveProcessAction = {
  __typename?: 'EvolveProcessAction';
  _?: Maybe<Scalars['Boolean']['output']>;
};

export type EvolveProcessesDiff = {
  __typename?: 'EvolveProcessesDiff';
  changes: ProposedProcessEvolution;
  processId: Scalars['String']['output'];
  processName: Scalars['String']['output'];
};

export type Group = {
  __typename?: 'Group';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  creator: User;
  groupType: GroupType;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  organization: Organization;
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
  inludeHatsBranch: Scalars['Boolean']['input'];
  tokenId: Scalars['String']['input'];
};

export type GroupNft = {
  __typename?: 'GroupNft';
  NftCollection: NftCollection;
  hatsBranch: Scalars['Boolean']['output'];
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

export type GroupType = DiscordRoleGroup | GroupNft;

export type Identity = {
  __typename?: 'Identity';
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

export enum InputDataType {
  Float = 'Float',
  Int = 'Int',
  StringArray = 'StringArray',
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

export type Me = {
  __typename?: 'Me';
  discordServers: Array<DiscordServer>;
  identities: Array<Identity>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  newAgents: Array<Agent>;
  newEditProcessRequest: Scalars['String']['output'];
  newProcess: Scalars['String']['output'];
  newRequest: Scalars['String']['output'];
  newResponse: Scalars['String']['output'];
  setUpDiscordServer: Group;
};


export type MutationNewAgentsArgs = {
  agents: Array<NewAgentArgs>;
};


export type MutationNewEditProcessRequestArgs = {
  inputs: NewEditProcessRequestArgs;
};


export type MutationNewProcessArgs = {
  process: NewProcessArgs;
};


export type MutationNewRequestArgs = {
  processId: Scalars['String']['input'];
  requestInputs?: InputMaybe<Array<RequestInputArgs>>;
};


export type MutationNewResponseArgs = {
  optionId: Scalars['String']['input'];
  requestId: Scalars['String']['input'];
};


export type MutationSetUpDiscordServerArgs = {
  input: SetUpDiscordServerInput;
};

export type NewAgentArgs = {
  groupDiscordRole?: InputMaybe<GroupDiscordRoleArgs>;
  groupEns?: InputMaybe<GroupEnsArgs>;
  groupHat?: InputMaybe<GroupHatArgs>;
  groupNft?: InputMaybe<GroupNftArgs>;
  identityBlockchain?: InputMaybe<IdentityBlockchainArgs>;
  identityDiscord?: InputMaybe<IdentityDiscordArgs>;
  identityEmail?: InputMaybe<IdentityEmailArgs>;
};

export enum NewAgentTypes {
  GroupDiscord = 'GroupDiscord',
  GroupHat = 'GroupHat',
  GroupNft = 'GroupNft',
  IdentityBlockchain = 'IdentityBlockchain',
  IdentityDiscord = 'IdentityDiscord',
  IdentityEmail = 'IdentityEmail'
}

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

export enum OptionType {
  Float = 'Float',
  Int = 'Int',
  Text = 'Text',
  Uri = 'Uri'
}

export type Organization = {
  __typename?: 'Organization';
  icon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ParentProcess = {
  __typename?: 'ParentProcess';
  id: Scalars['String']['output'];
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
  action?: Maybe<Action>;
  createdAt: Scalars['String']['output'];
  creator: User;
  currentProcessVersionId: Scalars['String']['output'];
  decisionSystem: DecisionTypes;
  description?: Maybe<Scalars['String']['output']>;
  evolve?: Maybe<Process>;
  expirationSeconds: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  inputs: Array<InputTemplate>;
  name: Scalars['String']['output'];
  options: Array<ProcessOption>;
  parent?: Maybe<ParentProcess>;
  roles: Roles;
  type: ProcessType;
  userRoles?: Maybe<UserRoles>;
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

export enum ProcessType {
  Custom = 'Custom',
  Evolve = 'Evolve'
}

export type ProposedProcessEvolution = {
  __typename?: 'ProposedProcessEvolution';
  current: Process;
  proposed: Process;
};

export type Query = {
  __typename?: 'Query';
  discordServerRoles: Array<DiscordApiServerRole>;
  group: Group;
  groupsForCurrentUser: Array<Group>;
  hatToken?: Maybe<ApiHatToken>;
  me?: Maybe<Me>;
  nftContract?: Maybe<AlchemyApiNftContract>;
  nftToken?: Maybe<AlchemyApiNftToken>;
  process: Process;
  processesForCurrentUser: Array<Process>;
  processesForGroup: Array<Process>;
  request: Request;
  requestsForCurrentUser: Array<Request>;
  requestsForGroup: Array<Request>;
  requestsForProcess: Array<Request>;
  searchNftContracts: Array<AlchemyApiNftContract>;
};


export type QueryDiscordServerRolesArgs = {
  serverId: Scalars['String']['input'];
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


export type QueryProcessArgs = {
  processId: Scalars['String']['input'];
};


export type QueryProcessesForCurrentUserArgs = {
  requestRoleOnly: Scalars['Boolean']['input'];
};


export type QueryProcessesForGroupArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryRequestsForGroupArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryRequestsForProcessArgs = {
  processId: Scalars['String']['input'];
};


export type QuerySearchNftContractsArgs = {
  chain: Blockchain;
  query: Scalars['String']['input'];
};

export type Request = {
  __typename?: 'Request';
  createdAt: Scalars['String']['output'];
  creator: User;
  evolveProcessChanges?: Maybe<Array<Maybe<EvolveProcessesDiff>>>;
  expirationDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inputs: Array<RequestInput>;
  name: Scalars['String']['output'];
  process: Process;
  responses: Responses;
  result?: Maybe<Result>;
};

export type RequestInput = {
  __typename?: 'RequestInput';
  description?: Maybe<Scalars['String']['output']>;
  inputTemplateId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  requestInputId: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: InputDataType;
  value: Scalars['String']['output'];
};

export type RequestInputArgs = {
  inputId: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Response = {
  __typename?: 'Response';
  createdAt: Scalars['String']['output'];
  optionId: Scalars['String']['output'];
  type: OptionType;
  user: User;
  value: Scalars['String']['output'];
};

export type ResponseCount = {
  __typename?: 'ResponseCount';
  count: Scalars['Int']['output'];
  optionId: Scalars['String']['output'];
  type: OptionType;
  value: Scalars['String']['output'];
};

export type Responses = {
  __typename?: 'Responses';
  allResponses: Array<Response>;
  responseCount: Array<ResponseCount>;
  userResponse?: Maybe<Response>;
};

export type Result = {
  __typename?: 'Result';
  actionComplete: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  selectedOption: ProcessOption;
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
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UserRoles = {
  __typename?: 'UserRoles';
  request: Scalars['Boolean']['output'];
  respond: Scalars['Boolean']['output'];
};

export type WebhookAction = {
  __typename?: 'WebhookAction';
  uri: Scalars['String']['output'];
};

export type WebhookActionArgs = {
  uri: Scalars['String']['input'];
};

export type NewEditProcessRequestArgs = {
  currentProcess: NewProcessArgs;
  evolvedProcess: NewProcessArgs;
  processId: Scalars['String']['input'];
};

export type NewProcessArgs = {
  action?: InputMaybe<ActionArgs>;
  decision: DecisionArgs;
  description?: InputMaybe<Scalars['String']['input']>;
  evolve: EvolveArgs;
  inputs: Array<InputTemplateArgs>;
  name: Scalars['String']['input'];
  options: Array<ProcessOptionArgs>;
  roles: Array<RoleArgs>;
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
  ActionType: ( EvolveProcessAction ) | ( WebhookAction );
  Agent: ( Omit<Group, 'groupType'> & { groupType: RefType['GroupType'] } ) | ( Omit<Identity, 'identityType'> & { identityType: RefType['IdentityType'] } );
  DecisionTypes: ( AbsoluteDecision ) | ( PercentageDecision );
  GroupType: ( DiscordRoleGroup ) | ( GroupNft );
  IdentityType: ( IdentityBlockchain ) | ( IdentityDiscord ) | ( IdentityEmail );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AbsoluteDecision: ResolverTypeWrapper<AbsoluteDecision>;
  AbsoluteDecisionArgs: AbsoluteDecisionArgs;
  Action: ResolverTypeWrapper<Omit<Action, 'actionDetails'> & { actionDetails?: Maybe<ResolversTypes['ActionType']> }>;
  ActionArgs: ActionArgs;
  ActionType: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ActionType']>;
  Agent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Agent']>;
  AgentType: AgentType;
  AlchemyApiNftContract: ResolverTypeWrapper<AlchemyApiNftContract>;
  AlchemyApiNftToken: ResolverTypeWrapper<AlchemyApiNftToken>;
  ApiHatToken: ResolverTypeWrapper<ApiHatToken>;
  Blockchain: Blockchain;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DecisionArgs: DecisionArgs;
  DecisionTypes: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DecisionTypes']>;
  DiscordAPIServerRole: ResolverTypeWrapper<DiscordApiServerRole>;
  DiscordRoleGroup: ResolverTypeWrapper<DiscordRoleGroup>;
  DiscordServer: ResolverTypeWrapper<DiscordServer>;
  DiscordServerOnboarded: ResolverTypeWrapper<DiscordServerOnboarded>;
  EvolveArgs: EvolveArgs;
  EvolveProcessAction: ResolverTypeWrapper<EvolveProcessAction>;
  EvolveProcessesDiff: ResolverTypeWrapper<EvolveProcessesDiff>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Group: ResolverTypeWrapper<Omit<Group, 'groupType'> & { groupType: ResolversTypes['GroupType'] }>;
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
  InputDataType: InputDataType;
  InputTemplate: ResolverTypeWrapper<InputTemplate>;
  InputTemplateArgs: InputTemplateArgs;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Me: ResolverTypeWrapper<Me>;
  Mutation: ResolverTypeWrapper<{}>;
  NewAgentArgs: NewAgentArgs;
  NewAgentTypes: NewAgentTypes;
  NftCollection: ResolverTypeWrapper<NftCollection>;
  NftTypes: NftTypes;
  OnboardedDiscordServer: ResolverTypeWrapper<OnboardedDiscordServer>;
  OptionType: OptionType;
  Organization: ResolverTypeWrapper<Organization>;
  ParentProcess: ResolverTypeWrapper<ParentProcess>;
  PercentageDecision: ResolverTypeWrapper<PercentageDecision>;
  PercentageDecisionArgs: PercentageDecisionArgs;
  Process: ResolverTypeWrapper<Omit<Process, 'decisionSystem'> & { decisionSystem: ResolversTypes['DecisionTypes'] }>;
  ProcessOption: ResolverTypeWrapper<ProcessOption>;
  ProcessOptionArgs: ProcessOptionArgs;
  ProcessType: ProcessType;
  ProposedProcessEvolution: ResolverTypeWrapper<ProposedProcessEvolution>;
  Query: ResolverTypeWrapper<{}>;
  Request: ResolverTypeWrapper<Request>;
  RequestInput: ResolverTypeWrapper<RequestInput>;
  RequestInputArgs: RequestInputArgs;
  Response: ResolverTypeWrapper<Response>;
  ResponseCount: ResolverTypeWrapper<ResponseCount>;
  Responses: ResolverTypeWrapper<Responses>;
  Result: ResolverTypeWrapper<Result>;
  RoleArgs: RoleArgs;
  RoleType: RoleType;
  Roles: ResolverTypeWrapper<Omit<Roles, 'edit' | 'request' | 'respond'> & { edit?: Maybe<ResolversTypes['Agent']>, request: Array<ResolversTypes['Agent']>, respond: Array<ResolversTypes['Agent']> }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  UserRoles: ResolverTypeWrapper<UserRoles>;
  WebhookAction: ResolverTypeWrapper<WebhookAction>;
  WebhookActionArgs: WebhookActionArgs;
  newEditProcessRequestArgs: NewEditProcessRequestArgs;
  newProcessArgs: NewProcessArgs;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AbsoluteDecision: AbsoluteDecision;
  AbsoluteDecisionArgs: AbsoluteDecisionArgs;
  Action: Omit<Action, 'actionDetails'> & { actionDetails?: Maybe<ResolversParentTypes['ActionType']> };
  ActionArgs: ActionArgs;
  ActionType: ResolversUnionTypes<ResolversParentTypes>['ActionType'];
  Agent: ResolversUnionTypes<ResolversParentTypes>['Agent'];
  AlchemyApiNftContract: AlchemyApiNftContract;
  AlchemyApiNftToken: AlchemyApiNftToken;
  ApiHatToken: ApiHatToken;
  Boolean: Scalars['Boolean']['output'];
  DecisionArgs: DecisionArgs;
  DecisionTypes: ResolversUnionTypes<ResolversParentTypes>['DecisionTypes'];
  DiscordAPIServerRole: DiscordApiServerRole;
  DiscordRoleGroup: DiscordRoleGroup;
  DiscordServer: DiscordServer;
  DiscordServerOnboarded: DiscordServerOnboarded;
  EvolveArgs: EvolveArgs;
  EvolveProcessAction: EvolveProcessAction;
  EvolveProcessesDiff: EvolveProcessesDiff;
  Float: Scalars['Float']['output'];
  Group: Omit<Group, 'groupType'> & { groupType: ResolversParentTypes['GroupType'] };
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
  InputTemplate: InputTemplate;
  InputTemplateArgs: InputTemplateArgs;
  Int: Scalars['Int']['output'];
  Me: Me;
  Mutation: {};
  NewAgentArgs: NewAgentArgs;
  NftCollection: NftCollection;
  OnboardedDiscordServer: OnboardedDiscordServer;
  Organization: Organization;
  ParentProcess: ParentProcess;
  PercentageDecision: PercentageDecision;
  PercentageDecisionArgs: PercentageDecisionArgs;
  Process: Omit<Process, 'decisionSystem'> & { decisionSystem: ResolversParentTypes['DecisionTypes'] };
  ProcessOption: ProcessOption;
  ProcessOptionArgs: ProcessOptionArgs;
  ProposedProcessEvolution: ProposedProcessEvolution;
  Query: {};
  Request: Request;
  RequestInput: RequestInput;
  RequestInputArgs: RequestInputArgs;
  Response: Response;
  ResponseCount: ResponseCount;
  Responses: Responses;
  Result: Result;
  RoleArgs: RoleArgs;
  Roles: Omit<Roles, 'edit' | 'request' | 'respond'> & { edit?: Maybe<ResolversParentTypes['Agent']>, request: Array<ResolversParentTypes['Agent']>, respond: Array<ResolversParentTypes['Agent']> };
  String: Scalars['String']['output'];
  User: User;
  UserRoles: UserRoles;
  WebhookAction: WebhookAction;
  WebhookActionArgs: WebhookActionArgs;
  newEditProcessRequestArgs: NewEditProcessRequestArgs;
  newProcessArgs: NewProcessArgs;
  setUpDiscordServerInput: SetUpDiscordServerInput;
};

export type AbsoluteDecisionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['AbsoluteDecision'] = ResolversParentTypes['AbsoluteDecision']> = {
  threshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = {
  actionDetails?: Resolver<Maybe<ResolversTypes['ActionType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionFilter?: Resolver<Maybe<ResolversTypes['ProcessOption']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ActionType'] = ResolversParentTypes['ActionType']> = {
  __resolveType: TypeResolveFn<'EvolveProcessAction' | 'WebhookAction', ParentType, ContextType>;
};

export type AgentResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Agent'] = ResolversParentTypes['Agent']> = {
  __resolveType: TypeResolveFn<'Group' | 'Identity', ParentType, ContextType>;
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

export type DecisionTypesResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['DecisionTypes'] = ResolversParentTypes['DecisionTypes']> = {
  __resolveType: TypeResolveFn<'AbsoluteDecision' | 'PercentageDecision', ParentType, ContextType>;
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

export type EvolveProcessActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveProcessAction'] = ResolversParentTypes['EvolveProcessAction']> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EvolveProcessesDiffResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['EvolveProcessesDiff'] = ResolversParentTypes['EvolveProcessesDiff']> = {
  changes?: Resolver<ResolversTypes['ProposedProcessEvolution'], ParentType, ContextType>;
  processId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  groupType?: Resolver<ResolversTypes['GroupType'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  memberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupNftResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupNft'] = ResolversParentTypes['GroupNft']> = {
  NftCollection?: Resolver<ResolversTypes['NftCollection'], ParentType, ContextType>;
  hatsBranch?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupTypeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['GroupType'] = ResolversParentTypes['GroupType']> = {
  __resolveType: TypeResolveFn<'DiscordRoleGroup' | 'GroupNft', ParentType, ContextType>;
};

export type IdentityResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Identity'] = ResolversParentTypes['Identity']> = {
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

export type InputTemplateResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['InputTemplate'] = ResolversParentTypes['InputTemplate']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['InputDataType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  discordServers?: Resolver<Array<ResolversTypes['DiscordServer']>, ParentType, ContextType>;
  identities?: Resolver<Array<ResolversTypes['Identity']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  newAgents?: Resolver<Array<ResolversTypes['Agent']>, ParentType, ContextType, RequireFields<MutationNewAgentsArgs, 'agents'>>;
  newEditProcessRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewEditProcessRequestArgs, 'inputs'>>;
  newProcess?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewProcessArgs, 'process'>>;
  newRequest?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewRequestArgs, 'processId'>>;
  newResponse?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationNewResponseArgs, 'optionId' | 'requestId'>>;
  setUpDiscordServer?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationSetUpDiscordServerArgs, 'input'>>;
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

export type OrganizationResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParentProcessResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ParentProcess'] = ResolversParentTypes['ParentProcess']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PercentageDecisionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['PercentageDecision'] = ResolversParentTypes['PercentageDecision']> = {
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quorum?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProcessResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Process'] = ResolversParentTypes['Process']> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  currentProcessVersionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decisionSystem?: Resolver<ResolversTypes['DecisionTypes'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evolve?: Resolver<Maybe<ResolversTypes['Process']>, ParentType, ContextType>;
  expirationSeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputs?: Resolver<Array<ResolversTypes['InputTemplate']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['ProcessOption']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['ParentProcess']>, ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['Roles'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProcessType'], ParentType, ContextType>;
  userRoles?: Resolver<Maybe<ResolversTypes['UserRoles']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProcessOptionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ProcessOption'] = ResolversParentTypes['ProcessOption']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OptionType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProposedProcessEvolutionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ProposedProcessEvolution'] = ResolversParentTypes['ProposedProcessEvolution']> = {
  current?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  proposed?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  discordServerRoles?: Resolver<Array<ResolversTypes['DiscordAPIServerRole']>, ParentType, ContextType, RequireFields<QueryDiscordServerRolesArgs, 'serverId'>>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<QueryGroupArgs, 'id'>>;
  groupsForCurrentUser?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  hatToken?: Resolver<Maybe<ResolversTypes['ApiHatToken']>, ParentType, ContextType, RequireFields<QueryHatTokenArgs, 'chain' | 'tokenId'>>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QueryNftContractArgs, 'address' | 'chain'>>;
  nftToken?: Resolver<Maybe<ResolversTypes['AlchemyApiNftToken']>, ParentType, ContextType, RequireFields<QueryNftTokenArgs, 'address' | 'chain' | 'tokenId'>>;
  process?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<QueryProcessArgs, 'processId'>>;
  processesForCurrentUser?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType, RequireFields<QueryProcessesForCurrentUserArgs, 'requestRoleOnly'>>;
  processesForGroup?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType, RequireFields<QueryProcessesForGroupArgs, 'groupId'>>;
  request?: Resolver<ResolversTypes['Request'], ParentType, ContextType, RequireFields<QueryRequestArgs, 'requestId'>>;
  requestsForCurrentUser?: Resolver<Array<ResolversTypes['Request']>, ParentType, ContextType>;
  requestsForGroup?: Resolver<Array<ResolversTypes['Request']>, ParentType, ContextType, RequireFields<QueryRequestsForGroupArgs, 'groupId'>>;
  requestsForProcess?: Resolver<Array<ResolversTypes['Request']>, ParentType, ContextType, RequireFields<QueryRequestsForProcessArgs, 'processId'>>;
  searchNftContracts?: Resolver<Array<ResolversTypes['AlchemyApiNftContract']>, ParentType, ContextType, RequireFields<QuerySearchNftContractsArgs, 'chain' | 'query'>>;
};

export type RequestResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Request'] = ResolversParentTypes['Request']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  evolveProcessChanges?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvolveProcessesDiff']>>>, ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputs?: Resolver<Array<ResolversTypes['RequestInput']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  process?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  responses?: Resolver<ResolversTypes['Responses'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestInputResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['RequestInput'] = ResolversParentTypes['RequestInput']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inputTemplateId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestInputId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['InputDataType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OptionType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseCountResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['ResponseCount'] = ResolversParentTypes['ResponseCount']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OptionType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponsesResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Responses'] = ResolversParentTypes['Responses']> = {
  allResponses?: Resolver<Array<ResolversTypes['Response']>, ParentType, ContextType>;
  responseCount?: Resolver<Array<ResolversTypes['ResponseCount']>, ParentType, ContextType>;
  userResponse?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  actionComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  selectedOption?: Resolver<ResolversTypes['ProcessOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['Roles'] = ResolversParentTypes['Roles']> = {
  edit?: Resolver<Maybe<ResolversTypes['Agent']>, ParentType, ContextType>;
  request?: Resolver<Array<ResolversTypes['Agent']>, ParentType, ContextType>;
  respond?: Resolver<Array<ResolversTypes['Agent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRolesResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['UserRoles'] = ResolversParentTypes['UserRoles']> = {
  request?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  respond?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebhookActionResolvers<ContextType = GraphqlRequestContext, ParentType extends ResolversParentTypes['WebhookAction'] = ResolversParentTypes['WebhookAction']> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphqlRequestContext> = {
  AbsoluteDecision?: AbsoluteDecisionResolvers<ContextType>;
  Action?: ActionResolvers<ContextType>;
  ActionType?: ActionTypeResolvers<ContextType>;
  Agent?: AgentResolvers<ContextType>;
  AlchemyApiNftContract?: AlchemyApiNftContractResolvers<ContextType>;
  AlchemyApiNftToken?: AlchemyApiNftTokenResolvers<ContextType>;
  ApiHatToken?: ApiHatTokenResolvers<ContextType>;
  DecisionTypes?: DecisionTypesResolvers<ContextType>;
  DiscordAPIServerRole?: DiscordApiServerRoleResolvers<ContextType>;
  DiscordRoleGroup?: DiscordRoleGroupResolvers<ContextType>;
  DiscordServer?: DiscordServerResolvers<ContextType>;
  DiscordServerOnboarded?: DiscordServerOnboardedResolvers<ContextType>;
  EvolveProcessAction?: EvolveProcessActionResolvers<ContextType>;
  EvolveProcessesDiff?: EvolveProcessesDiffResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupNft?: GroupNftResolvers<ContextType>;
  GroupType?: GroupTypeResolvers<ContextType>;
  Identity?: IdentityResolvers<ContextType>;
  IdentityBlockchain?: IdentityBlockchainResolvers<ContextType>;
  IdentityDiscord?: IdentityDiscordResolvers<ContextType>;
  IdentityEmail?: IdentityEmailResolvers<ContextType>;
  IdentityType?: IdentityTypeResolvers<ContextType>;
  InputTemplate?: InputTemplateResolvers<ContextType>;
  Me?: MeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NftCollection?: NftCollectionResolvers<ContextType>;
  OnboardedDiscordServer?: OnboardedDiscordServerResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  ParentProcess?: ParentProcessResolvers<ContextType>;
  PercentageDecision?: PercentageDecisionResolvers<ContextType>;
  Process?: ProcessResolvers<ContextType>;
  ProcessOption?: ProcessOptionResolvers<ContextType>;
  ProposedProcessEvolution?: ProposedProcessEvolutionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Request?: RequestResolvers<ContextType>;
  RequestInput?: RequestInputResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  ResponseCount?: ResponseCountResolvers<ContextType>;
  Responses?: ResponsesResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  Roles?: RolesResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRoles?: UserRolesResolvers<ContextType>;
  WebhookAction?: WebhookActionResolvers<ContextType>;
};

