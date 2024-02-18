import { GraphqlRequestContext } from "@graphql/context";
import { MutationNewFlowArgs } from "@graphql/generated/resolver-types";
import { newCustomFlow as newCustomFlowService } from "@/flow/flow/newCustomFlow";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

// const getFlow = async (root: unknown, args: {}, context: GraphqlRequestContext) => {
//   return "";
// };

const newFlow = async (
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

export const flowQueries = {};
