import { getFlow as getFlowService } from "@/core/flow/getFlow";
import { getFlows as getFlowsService } from "@/core/flow/getFlows";
import { newCustomFlow as newCustomFlowService } from "@/core/flow/flowTypes/customFlow/newCustomFlow";
import { GraphqlRequestContext } from "@graphql/context";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import {
  MutationNewFlowArgs,
  MutationResolvers,
  QueryGetFlowArgs,
  QueryGetFlowsArgs,
  QueryGetGroupsToWatchFlowArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";

import { getGroupsToWatchFlow as getGroupsToWatchFlowService } from "@/core/flow/getGroupsToWatchFlow";
import { logResolverError } from "../logResolverError";

const getFlow: QueryResolvers["getFlow"] = async (
  root: unknown,
  args: QueryGetFlowArgs,
  context: GraphqlRequestContext,
) => {
  try {
    return await getFlowService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "getFlow", operation: "query", location: "graphql" },
        contexts: { args },
      },
    });
  }
};

const getFlows: QueryResolvers["getFlows"] = async (
  root: unknown,
  args: QueryGetFlowsArgs,

  context: GraphqlRequestContext,
) => {
  try {
    return await getFlowsService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "getFlows", operation: "query", location: "graphql" },
        contexts: { args },
      },
    });
  }
};

const newFlow: MutationResolvers["newFlow"] = async (
  root: unknown,
  args: MutationNewFlowArgs,
  context: GraphqlRequestContext,
) => {
  try {
    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
    const flowId = await newCustomFlowService({
      args,
      entityContext: {
        type: "user",
        context,
      },
    });

    return flowId;
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newFlow", operation: "mutation", location: "graphql" },
        contexts: { args },
      },
    });
  }
};

const getGroupsToWatchFlow: QueryResolvers["getGroupsToWatchFlow"] = async (
  root: unknown,
  args: QueryGetGroupsToWatchFlowArgs,
  context: GraphqlRequestContext,
) => {
  try {
    return await getGroupsToWatchFlowService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "getGroupsToWatchFlow", operation: "query", location: "graphql" },
        contexts: { args },
      },
    });
  }
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {
  getFlow,
  getFlows,
  getGroupsToWatchFlow,
};
