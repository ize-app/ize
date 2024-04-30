import { NewStepArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newFieldSet } from "@/core/fields/newFieldSet";
import { newPermission } from "@/core/permission/newPermission";
import { newResultConfigSet } from "@/core/result/newResultConfig";
import { newActionConfig } from "@/core/action/newAction";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { StepPrismaType, stepInclude } from "../flowPrismaTypes";

export const newStep = async ({
  args,
  flowVersionId,
  index,
  reusable,
  createdSteps,
  transaction,
}: {
  args: NewStepArgs;
  flowVersionId: string;
  index: number;
  reusable: boolean;
  createdSteps: StepPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<StepPrismaType> => {
  if (!args.request?.permission && !(!reusable || index > 0))
    throw new GraphQLError("Request permissions required for the first step of reusable flows.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const requestFieldSet = args.request
    ? await newFieldSet({ fields: args.request.fields, transaction, createdSteps })
    : null;

  const responseFieldSet = args.response
    ? await newFieldSet({ fields: args.response.fields, transaction, createdSteps })
    : null;

  const requestPermissionsId = await newPermission({
    permission: args.request.permission,
    stepIndex: index,
    transaction,
  });

  const responsePermissionsId = args.response
    ? await newPermission({
        permission: args.response.permission,
        stepIndex: index,
        transaction,
      })
    : null;

  const resultConfigSetId = await newResultConfigSet({
    resultsArgs: args.result,
    transaction,
    responseFieldSet,
  });

  const actionId = args.action
    ? await newActionConfig({
        actionArgs: args.action,
        responseFieldSet,
        transaction,
      })
    : null;

  const step = await transaction.step.create({
    include: stepInclude,
    data: {
      allowMultipleResponses: args.allowMultipleResponses,
      requestFieldSetId: requestFieldSet?.id,
      requestPermissionsId: requestPermissionsId,
      responseFieldSetId: responseFieldSet?.id,
      responsePermissionsId: responsePermissionsId,
      actionId: actionId,
      resultConfigSetId: resultConfigSetId,
      index,
      flowVersionId,
      expirationSeconds: args.expirationSeconds,
    },
  });

  createdSteps.push(step);

  return step;
};
