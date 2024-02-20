import { NewStepArgs, ResultType } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newFieldSet } from "@/flow/fields/newFieldSet";
import { newPermission } from "@/flow/permission/newPermission";
import { newResultConfig } from "@/flow/result/newResultConfig";
import { newActionConfig } from "@/flow/action/newAction";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newStep = async ({
  args,
  flowVersionId,
  index,
  reusable,
  transaction,
}: {
  args: NewStepArgs;
  flowVersionId: string;
  index: number;
  reusable: boolean;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  if (!args.request?.permission && !(!reusable || index > 0))
    throw new GraphQLError("Request permissions required for the first step of reusable flows.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (
    (!args.response?.permission || !args.response.fields) &&
    args.result.type !== ResultType.AutoApprove
  )
    throw new GraphQLError("Response fields are missing", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const requestFieldSet = args.request
    ? await newFieldSet({ fields: args.request.fields, transaction })
    : null;
  const responseFieldSet = args.response
    ? await newFieldSet({ fields: args.response.fields, transaction })
    : null;

  // in current version, there is only one response field per step
  const responseField = responseFieldSet?.FieldSetFields[0].Field;

  const requestPermissionsId = args.request
    ? await newPermission({
        permission: args.request.permission,
        stepIndex: index,
        transaction,
      })
    : null;

  const responsePermissionsId = args.response
    ? await newPermission({
        permission: args.response.permission,
        stepIndex: index,
        transaction,
      })
    : null;

  const resultConfigId = await newResultConfig({
    resultArgs: args.result,
    transaction,
    responseField,
  });

  const actionId = await newActionConfig({
    actionArgs: args.action,
    transaction,
    responseField,
  });

  const step = await transaction.step.create({
    data: {
      requestFieldSetId: requestFieldSet?.id,
      requestPermissionsId: requestPermissionsId,
      responseFieldSetId: responseFieldSet?.id,
      responsePermissionsId: responsePermissionsId,
      actionId: actionId,
      resultConfigId: resultConfigId,
      index,
      flowVersionId,
    },
  });

  return step.id;
};
