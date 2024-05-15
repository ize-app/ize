import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { flowInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { GraphqlRequestContext } from "../../graphql/context";
import { hasWritePermission } from "../permission/hasWritePermission";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { createRequestDefinedOptionSet } from "./createRequestDefinedOptionSet";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newRequest = async ({
  args,
  context,
  transaction = prisma,
}: {
  args: MutationNewRequestArgs;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  const {
    request: { requestDefinedOptions, requestFields, flowId },
  } = args;

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

  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const request = await transaction.request.create({
    data: {
      name: args.request.name,
      flowVersionId: flow.CurrentFlowVersion.id,
      creatorId: context.currentUser.id,
      final: false,
    },
  });

  const requestStep = await transaction.requestStep.create({
    data: {
      expirationDate: new Date(new Date().getTime() + (step.expirationSeconds as number) * 1000),
      Request: {
        connect: {
          id: request.id,
        },
      },
      Step: {
        connect: {
          id: step.id,
        },
      },
      CurrentStepParent: {
        connect: {
          id: request.id,
        },
      },
    },
  });

  const requestDefinedOptionSets = await Promise.all(
    requestDefinedOptions.map(async (r) => {
      return await createRequestDefinedOptionSet({
        step,
        requestStepId: requestStep.id,
        newOptionArgs: r.options,
        fieldId: r.fieldId,
        isTriggerDefinedOptions: true,
        transaction,
      });
    }),
  );

  // TODO: if auto approve, just create the result

  await newFieldAnswers({
    fieldSet: step.RequestFieldSet,
    fieldAnswers: requestFields,
    requestDefinedOptionSets: requestDefinedOptionSets,
    requestStepId: requestStep.id,
    transaction,
  });

  return request.id;
};
