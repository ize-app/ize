import { GraphqlRequestContext } from "@graphql/context";
import { MutationNewFlowArgs } from "@graphql/generated/resolver-types";
import { newFlow as newFlowService } from "@/flow/flow/newFlow";

// const getFlow = async (root: unknown, args: {}, context: GraphqlRequestContext) => {
//   return "";
// };

const newFlow = async (
  root: unknown,
  args: MutationNewFlowArgs,
  context: GraphqlRequestContext,
) => {
  await newFlowService({ args });
  return "";
};

export const flowMutations = {
  newFlow,
};

export const flowQueries = {};
