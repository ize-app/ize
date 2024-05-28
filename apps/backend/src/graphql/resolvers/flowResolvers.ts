import { getFlow as getFlowService } from "@/core/flow/getFlow";
import { getFlows as getFlowsService } from "@/core/flow/getFlows";
import { newCustomFlow as newCustomFlowService } from "@/core/flow/newCustomFlow";
import { GraphqlRequestContext } from "@graphql/context";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import {
  MutationNewFlowArgs,
  MutationResolvers,
  QueryGetFlowArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";

const getFlow: QueryResolvers["getFlow"] = async (
  root: unknown,
  args: QueryGetFlowArgs,
  context: GraphqlRequestContext,
) => {
  return await getFlowService({ args, user: context.currentUser });
};

const getFlows: QueryResolvers["getFlows"] = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
) => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  return await getFlowsService({ user: context.currentUser });
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
  return await newCustomFlowService({ args, creatorId: context.currentUser.id });
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {
  getFlow,
  getFlows,
};
