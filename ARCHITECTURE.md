# Architecture

Core concepts of Ize architecture

- **[Entities](#entities)**: Entities are the core permissioning object of of Ize. An entity can be an Ize user, an idenity authenticated via another platform (e.g. Discord or Ethereum), or a group of identities defined via Ize or another platform (e.g. a Telegram group).
- **[Flows](#flows)**: Flows are a reusable configuration for how a group accomplishes a collective process together (e.g. making a decision, coming to a shared understanding, or triggering another tool). _Everything_ in Ize happens via collaborative flows. There is no concept of an admin in Ize.
- **[Requests](#requests)**: Requests are instances of a flow being triggered.
- **[Watching flows and groups](#watching-flows-and-groups)** How users and Ize groups subscribe to flows they want to receive notifications for.
- **[Chat platform integrations](#chat-platform-integrations)** Teams can link a chat platform to an Ize group so that the team can participate in and trigger flows directly within the chat.

## Entities

Entities are the permissioning object within Ize. Entities can refer to users/groups defined within Ize or external platforms.

### Users

A user is an individual who has created an account via the Ize web app. User authentication is handled via Stytch, and users can log-in via Email, ETH address, Google login, or Discord (see: [authRouter.ts](apps/backend/src/express/authRouter.ts)).

A user account is associated with one or more identities (email, Discord, ETH address, or Telegram). A user can take actions (e.g. trigger flows and respond to requests) on behalf of any of their associated identities within the Ize app.

A user can add additional identities via the [sign-up flow](apps/frontend/src/pages/NewUser/screens/Setup.tsx) or [settings](apps/frontend/src/pages/Settings/UserSettings.tsx) page. To add an identity, the user must complete the authentication flow for that identity provider to prove it is their identity. This authentication flow is facilitated by Stytch for Discord, Ethereum, and email, but Telegram authentication is handled separately.

### Identities

Identities reference identities in third party platforms (e.g. Ethereum, Discord, Telegram, email). Ize is built to be extendable for additional identity providers in the future.

As mentioned, identities can be associated with a user. However, an identity does not need to be associated with a user. For example:

- A flow can give permissions to an identity, even if the person owning that identity hasn't yet created an account with Ize
- With the Telegram integration, a Telegram identity can trigger/respond to a flow within Telegram without having a user account in Ize.

### Groups

Groups are sets of identities and groups. They can be defined by third-party platforms or within Ize. Membership of groups is handled differently for write/read operations

- **Write**: Group membership is verified before every write operation of flow/request (see: [hasWriteUserPermission.ts](apps/backend/src/core/permission/hasWritePermission/hasWriteUserPermission.ts))
- **Read**: To tell a user whether they are a part of group, we use [hasReadPermission](apps/backend/src/core/permission/hasReadPermission.ts) which queries a database cache of entities_groups. entities_groups is updated in the following situations:
  - A user logs in
  - A user adds an identity
  - A telegram identity's membership with a telegram group is checked
  - A new custom group is created

#### Third-party platform groups

A third-party platform defined group can include:

- **Discord roles**: A member of a Discord server will have permissions to the @everyone role and may have access to additional roles (e.g. @moderator). Roles besides @everyone are only selectable and able to be validated if the Ize Discord bot is added to the Discord server.
- **NFTs**: NFT groups can be defined via ownership of any NFT in a collection or ownership of a specific token ID. NFT ownership verified via Alchemy
- **Hats NFTs**: Same validation logic as NFT group membership, except permission validation also checks whether or not a Hat is active.
- **Telegram groups**: Whether or not a user is part of a Telegram group. Telegram group membership can only be validated if a the Ize bot is added to the Telegram group.

#### Ize groups

Users can also create "Ize groups", which is a set of identities, users, or groups. Ize groups cannot be members of another Ize group.

The purpose of Ize groups is twofold:

- Create a group homepage where a user can see requests and flows relevant to that group (see [group page](apps/frontend/src/pages/Group/Group.tsx))
- Give users a shorthand reference for sets of identities/groups that can be used in Ize flow permissioning

Ize groups can be associated with a chat platform where Ize notifications will be sent and where users can both trigger and respond to Ize flows natively within the chat. For now, Telegram is the only chat platform provided.

Unlike other SaaS tools, Ize groups do not have an admin. Instead, every new Ize group comes with two default flows which define how the group can modify the group. These flows are:

- **Evolve group**: Used for evolving group membership, name, description, etc.
- **Watch flows**: This allows a group to "subscribe" to a flow, which essentially means it is vouching for that flow and opting to receive notifications for that flow.

## Flows

Flows are configuration that define how a collective process works. Flows can define and automate _any_ kind of deliberative workflow. Flows have a context and particular _job-to-be-done_. For example, they can facilitate how:

- A sub-DAO allocates and disburses budget amongst competing priorities.
- An AI agent gets buy-in from an engineering team before creating tasks in Asana.
- How an activist organization vets and onboards new contributors.
- How two start-ups align on the go-to-market strategy of a partnership.

This flexibility is made possible by the **Ize process language** - a declarative, modular language that ties together:

- **Participants**: Web2/web3 identities (Slack channels, Hats NFTs, Telegram groups, etc.) and AI agents
- **Deliberative modes**: Decision-making, AI-assisted facilitation, prioritization, sentiment analysis, etc.
- **3rd party tools\***:* Automated action in external tools based on deliberative outcomes \*\*(e.g. disbursing funding, calendar management, pull requests, etc.)

The vision of flows is to be a modular, open-source plug-in ecosystem for defining and automating collective process.

Front-end configuration validation of a flow is handled via [flow.ts](apps/frontend/src/components/Form/FlowForm/formValidation/flow.ts) and flow creation is managed via [newCustomFlow.ts](apps/backend/src/core/flow/flowTypes/customFlow/newCustomFlow.ts).

### Anatomy of a flow: The Ize minimum viable ontology

You can think of an Ize flow in the same way you have a CI-CD (e.g. Github Actions) config or Zapier workflow. It's a reusable configuration that can enable a workflow. But in contrast to workflow automation tools like Zapier, Ize is intended to enable automating _collective_ workflows that solicit input from humans, rather than pure automation.

The goal of flows is to be a minimum viable ontology for describing any kind of collective process. This minimum viable ontology enables two things:

1. A generic framework on which novel deliberative collective sensemaking methodologies can be developed by an open source community to enable any virtually any kind of collective process.
2. A state machine of a collective process to enable notifications/integrations within external tools.

Let's explore this minimum viable ontology. Flows have the following basic structure

- **Trigger**: Who can initiate a workflow and the context required to trigger that workflow.
- **Collaborative step(s)**: A collaborative step solicits some kind of input from a set of users and creates a result.
- *Action*: At the end of a flow, an action can be triggered which may trigger an action in an external tool (via webhooks) or within Ize itself (evolving flows, evolving groups, etc)

Currently flows only support linear flows. In the future, we we hope to support branching and looping logic.

#### Trigger

The trigger defines:

- **Permissions**: The [entities](#entities) who can trigger a flow
- **Context fields**: Fields that are required to be a provided to trigger a field. These can be text, option selection, date, time, or number fields. In the future, we hope to extend this to additional data types (audio, video, JSON, etc)

Note that flows can be _reusable_ or _non-reusable_. If non-reusable, the flow will automatically trigger a [request](#requests) and it cannot be triggered again.

#### Collaborative step(s)

A collaborative step defines how responses to a question(s) are collected and aggregated into a final result.

- **Response fields**: Fields that are part of a response to a collaborative step. These can be text, option selections, date, time, or number fields. In the future, we hope to extend this to additional data types (audio, video, JSON, etc). Option fields can specify that results from prior steps are included as options.
- **Response permissions**: This includes permissions on the [entities](#entities) who can respond as well as additional configuration on how long responses can be collected for (e.g. how long people have to respond, whether the response period can be manually ended, and whether respondents can respond multiple times.)
- **Result configuration**: This defines how responses are aggregated into a final result. There are multiple kinds of results:
  - _Decision_: A single option is selected. There are different kinds of decisions (ranked choice, most selected option, letting AI decide, threshold voting). Users can choose a default decision if there is no final result (i.e. optimistic governance).
  - _AI summary_: Responses are aggregated into a final result or list of results. The user can specify a prompt that is used to summarize these responses.
  - _Prioritized list_: Option selections are prioritized into a list of options.
  - _Raw results_: The result is simply the raw list of responses from users

#### Action

Every collaborative step ends with an action. Currently the supported actions include:

- **Trigger another step**: Triggers the next collaborative step of a flow
- **Trigger a webhook**: Triggers a webhook. This is a simple mechanism for Ize to trigger actions in any kind of external tool. When a webhook is triggered, it includes a payload with context for that request.
- **Evolve an Ize group**: Evolve a group metadata
- **Evolve a flow**: Update the configuration of a flow to the proposed version.
- **Watch a flow**: Subscribe to a flow on behalf of an Ize group.

In the future, we aim to enable actions that are directly integrated into external tools (e.g. a "Create calendar invite" action).

Actions can also define a "action filter", which will only execute an action if a collaborative step has a specific result.

### Flow evolution

Flows are evolved through other flows. When a new flow is created, it also creates an "Evolve flow" that defines how a collective can propose and approve changes to that flow.

Evolving a flow happens through the following process

- **Evolve flow is triggered**: A user with appropriate permissions proposes changes to a flow. This creates a new flow version and a request to update the flow to use that flow version see [newEvolveRequest.ts](apps/backend/src/core/request/newEvolveRequest.ts).
- **Collaborative step occurs to approve that flow**: Users with appropriate permissions vote on whether they want to approve that flow.
- **New flow is approved and flow is evolved**: If the flow evolution is approved, the flow will now use the newly created flow version for all future requests. All requests prior to this approval will continue to use the old flow version configuration.

## Requests

When flows are triggered, they create _requests_. A request is an instance of a flow.

Requests are state machines that go through the following progression

- **Request triggered**: A user triggers a request for a flow. A request will only be created if a user has included the appropriate context and has trigger permissions. See [newRequest.ts](apps/backend/src/core/request/newRequest.ts)
- **Collaborative step**: When a request enters a new step, a requestStep is created. requestSteps track the state of a given step within a request. The request step has the following progression
  - _Notifications sent out to chat platforms_: Notifications are sent out to any Ize group that has opted in to receive notifications in a group of a given chat platform. Currently only Telegram notifications in Telegram groups are supported. See [sendNewStepNotifications.ts](apps/backend/src/core/notification/sendNewStepNotifications/sendNewStepNotifications.ts)
  - _Collect responses_: Users with appropriate permissions respond to the fields defined in that step. Each new response calls (see: [newResponse.ts](apps/backend/src/core/response/newResponse.ts)). After each response, a preliminary result is created. Once a condition is met to end collecting responses (e.g. time period to respond expires or step is manually ended), the response period is ended (see: [finalizeStepResponses.ts](apps/backend/src/core/request/updateState/finalizeStepResponses.ts))
  - _Finalize result_: Once the response period ends and if there is a final result, the result is finalized (see: [finalizeStepResults.ts](apps/backend/src/core/request/updateState/finalizeStepResults.ts))
  - _Execute action_: Once there is a final result, the final action is triggered (see: [executeAction.ts](apps/backend/src/core/action/executeActions/executeAction.ts)). If the action is to trigger a new step in the flow, a new requestStep is created and this progression happens again for the next step.
- **Retry logic**: Incomplete results and actions are periodically retried via [updateRequestsCron.ts](apps/backend/src/core/request/updateRequestsCron/updateRequestsCron.ts)
- **Request is finalized**: Once the final collaborative step and action is complete, the request is marked as final

## Watching flows and groups

Both users and Ize groups have fine grained control on the flows they want receive notifications. Subscribing to a receive notifications is called _watching_.

Both Ize users and Ize groups can watch flows.

### How Ize groups "watch"

[Ize groups](#ize-groups) can watch/unwatch flows via the "Watch Flow" flow. When an Ize group watches a flow, there are the following consequences:

- The flow and requests generated by that flow will appear on that Ize group's homepage
- The group will receive notifications about that flow in their connected chat platform (e.g. Telegram)

### How users "watch"

Users can watch both flows and groups.

When a user watches a flow, there are the following consequences:

- Requests for that flow will appear on the user's dashboard
- The flow will appear on the user's "Flow templates" page

When a user watches an Ize group, there are the following consequences:

- The group will appear in the user's nav bar
- Requests created for flows that the Ize group watches will appear in the user's dashboard.

Users automatically watch flows they create or respond to. Users automatically watch groups they create.

## Chat platform integrations

The goal of Ize is for groups to trigger and participate in flows directly within the chat platform that the group uses.

Currently, the only supported Chat platform is Telegram but in the future we hope to support others like Discord, Slack, etc. See [TelegramClient.ts](apps/backend/src/telegram/TelegramClient.ts).

When a Telegram chat is linked to an Ize group, it will receive notifications for all new requests of results of flows that the Ize group is watching.

Telegram chat members can respond to Ize flows directly within Telegram. Only certain kinds of fields can be responded to directly in the chat (single option select and free text response). Individuals can respond even if they do not have a user account with Ize as long as their Telegram identity has permissions to respond to that flow.

Telegram chat members can also trigger a set of "default" flows directly within the hat via slash commands. See [handleGenerateFlowCommand.ts](apps/backend/src/telegram/commands/handleGenerateFlowCommand.ts).
