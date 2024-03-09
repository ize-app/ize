import { NewStepArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newFieldSet } from "@/flow/fields/newFieldSet";
import { newPermission } from "@/flow/permission/newPermission";
import { newResultConfigSet } from "@/flow/result/newResultConfig";
import { newActionConfig } from "@/flow/action/newAction";
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

  const actionId = await newActionConfig({
    actionArgs: args.action,
    responseFieldSet,
    transaction,
  });

  const step = await transaction.step.create({
    include: stepInclude,
    data: {
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
