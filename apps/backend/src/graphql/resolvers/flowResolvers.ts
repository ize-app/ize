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
import { updateUserGroups } from "@/core/entity/updateIdentitiesGroups/updateUserGroups/updateUserGroups";
import { getGroupsToWatchFlow as getGroupsToWatchFlowService } from "@/core/flow/getGroupsToWatchFlow";

const getFlow: QueryResolvers["getFlow"] = async (
  root: unknown,
  args: QueryGetFlowArgs,
  context: GraphqlRequestContext,
) => {
  return await getFlowService({ args, context });
};

const getFlows: QueryResolvers["getFlows"] = async (
  root: unknown,
  args: QueryGetFlowsArgs,

  context: GraphqlRequestContext,
) => {
  return await getFlowsService({ args, context });
};

const newFlow: MutationResolvers["newFlow"] = async (
  root: unknown,
  args: MutationNewFlowArgs,
  context: GraphqlRequestContext,
) => {
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

  // associate user with any new identities that were created when creating the new flow
  await updateUserGroups({ context });

  return flowId;
};

const getGroupsToWatchFlow: QueryResolvers["getGroupsToWatchFlow"] = async (
  root: unknown,
  args: QueryGetGroupsToWatchFlowArgs,
  context: GraphqlRequestContext,
) => {
  return await getGroupsToWatchFlowService({ args, context });
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {
  getFlow,
  getFlows,
  getGroupsToWatchFlow,
};
