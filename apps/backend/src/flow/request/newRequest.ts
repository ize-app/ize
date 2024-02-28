import { prisma } from "../../prisma/client";
import { MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { flowInclude } from "@/flow/flow/types";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { GraphqlRequestContext } from "../../graphql/context";
import { hasWritePermission } from "../permission/hasWritePermission";

export const newRequest = async ({
  args,
  context,
}: {
  args: MutationNewRequestArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  const {
    request: { requestDefinedOptions, requestFields, flowId },
  } = args;

  return await prisma.$transaction(async (transaction) => {
    const flow = await transaction.flow.findUniqueOrThrow({
      where: {
        id: flowId,
      },
      include: flowInclude,
    });

    if (!flow.CurrentFlowVersion)
      throw new GraphQLError("Missing current version of flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    const step = flow.CurrentFlowVersion.Steps[0];

    if (!hasWritePermission({ permission: step.RequestPermissions, context, transaction }))
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    // create request and request step
    // if auto approve, just create the result
    // validate fields against flow step, has required fields, data types are correct --> create fields
    // validate request definedoptions  --> create request defined options

    return "sup";
  });
};
