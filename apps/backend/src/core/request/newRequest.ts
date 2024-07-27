import { Prisma } from "@prisma/client";

import { createFlowInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { FlowType, MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { createRequestDefinedOptionSet } from "./createRequestDefinedOptionSet";
import { GraphqlRequestContext } from "../../graphql/context";
import { executeAction } from "../action/executeActions/executeAction";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { hasWritePermission } from "../permission/hasWritePermission";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newRequest = async ({
  args,
  context,
  // proposed flow version id is used when creating an evolution request
  proposedFlowVersionId,
  transaction,
}: {
  args: MutationNewRequestArgs;
  context: GraphqlRequestContext;
  proposedFlowVersionId?: string;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const {
    request: { requestDefinedOptions, requestFields, flowId },
  } = args;

  const flow = await transaction.flow.findUniqueOrThrow({
    where: {
      id: flowId,
    },
    include: createFlowInclude(context.currentUser?.id),
  });

  if (!flow.CurrentFlowVersion)
    throw new GraphQLError("Missing current version of flow", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (flow.type === FlowType.Evolve && !proposedFlowVersionId)
    throw new GraphQLError(
      `Request for evolve flow id ${flow.id} is missing proposedFlowVersionId`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

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
      proposedFlowVersionId,
      final: false,
    },
  });

  const hasResponseFields = !!step.ResponseFieldSet;

  const requestStep = await transaction.requestStep.create({
    data: {
      expirationDate: new Date(new Date().getTime() + (step.expirationSeconds as number) * 1000),
      responseComplete: !hasResponseFields,
      resultsComplete: !hasResponseFields,
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

  if (!hasResponseFields) {
    await executeAction({ step, results: [], requestStepId: requestStep.id });
  }

  return request.id;
  // });
};
