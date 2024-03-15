import { prisma } from "../../prisma/client";
import { MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { flowInclude } from "@/flow/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { GraphqlRequestContext } from "../../graphql/context";
import { hasWritePermission } from "../permission/hasWritePermission";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { newOptionSet } from "../fields/newOptionSet";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
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

    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    const request = await transaction.requestNew.create({
      data: {
        name: args.request.name,
        flowVersionId: flow.CurrentFlowVersion.id,
        creatorId: context.currentUser.id,
      },
    });

    await newFieldAnswers({
      fieldSet: step.RequestFieldSet,
      fieldAnswers: requestFields,
      transaction,
    });

    await Promise.all(
      requestDefinedOptions.map(async (r) => {
        if (!step.ResponseFieldSet)
          throw new GraphQLError(
            "Request defined options provided, but this flow step does not have response fields.",
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        const field = step.ResponseFieldSet.FieldSetFields.find((f) => f.fieldId === r.fieldId);
        if (!field)
          throw new GraphQLError(
            "Cannot find flow field corresponding to request defined options.",
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        if (
          field.Field.FieldOptionsConfigs?.hasRequestOptions ||
          !field.Field.FieldOptionsConfigs?.requestOptionsDataType
        )
          throw new GraphQLError(
            "Request deifned options provided but this field does not allow request defined options.",
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        await newOptionSet({
          transaction,
          options: r.options,
          dataType: field.Field.FieldOptionsConfigs?.requestOptionsDataType,
        });
      }),
    );

    await transaction.requestStep.create({
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

    // TODO: if auto approve, just create the result
    
    return request.id;
  });
};
