import { GraphqlRequestContext } from "@graphql/context";
import {
  MutationNewFlowArgs,
  MutationResolvers,
  QueryGetFlowArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";
import { newCustomFlow as newCustomFlowService } from "@/core/flow/newCustomFlow";
import { getFlow as getFlowService } from "@/core/flow/getFlow";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

const getFlow: QueryResolvers["getFlow"] = async (
  root: unknown,
  args: QueryGetFlowArgs,
  context: GraphqlRequestContext,
) => {
  return await getFlowService({ args, user: context.currentUser });
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
  return await newCustomFlowService({ args });
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {
  getFlow,
};
