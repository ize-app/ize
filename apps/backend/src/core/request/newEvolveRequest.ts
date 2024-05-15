import { prisma } from "../../prisma/client";
import { MutationNewEvolveRequestArgs } from "@graphql/generated/resolver-types";
import { GraphqlRequestContext } from "../../graphql/context";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newEvolveRequest = async ({
  args,
  context,
}: {
  args: MutationNewEvolveRequestArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  const {
    request: { proposedFlow, currentFlow },
  } = args;

  console.log("proposed flow", proposedFlow);
  console.log("current flow", currentFlow);

  return await prisma.$transaction(async (transaction) => {
    return "";
  });
};
