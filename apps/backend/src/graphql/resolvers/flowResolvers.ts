import { getFlow as getFlowService } from "@/core/flow/getFlow";
import { getFlows as getFlowsService } from "@/core/flow/getFlows";
import { newCustomFlow as newCustomFlowService } from "@/core/flow/customFlow/newCustomFlow";
import { GraphqlRequestContext } from "@graphql/context";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import {
  MutationNewFlowArgs,
  MutationResolvers,
  QueryGetFlowArgs,
  QueryGetFlowsArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";
import { updateUserGroups } from "@/core/entity/updateIdentitiesGroups/updateUserGroups/updateUserGroups";
import { watchFlow } from "@/core/user/watchFlow";

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
  return await getFlowsService({ args, user: context.currentUser });
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
  const flowId = await newCustomFlowService({ args, context });

  await watchFlow({ flowId, watch: true, userId: context.currentUser.id });

  // associate user with any new identities that were created when creating the new flow
  await updateUserGroups({ context });

  return flowId;
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {
  getFlow,
  getFlows,
};
