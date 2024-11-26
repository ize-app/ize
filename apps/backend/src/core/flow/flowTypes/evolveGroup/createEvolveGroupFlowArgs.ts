import { GraphQLError } from "graphql";

import { createSystemFieldDefaults } from "@/core/fields/createSystemFieldDefaults";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import {
  ActionType,
  FieldArgs,
  FlowType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  NewFlowArgs,
  NewStepArgs,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

import { createActionArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createActionArgsForPolicy";
import { createApprovalFieldSetArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createApprovalFieldSetArgsForPolicy";
import { createDecisionResultArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createDecisionResultArgsForPolicy";

// const requestFieldSetArgs: FieldArgs[] = [
//   createSystemFieldDefaults(SystemFieldType.GroupName),
//   createSystemFieldDefaults(SystemFieldType.GroupDescription),
//   createSystemFieldDefaults(SystemFieldType.GroupMembers),
// ];

export const createEvolveGroupFlowArgs = ({
  groupEntityId,
  context,
  policy,
}: {
  context: GraphqlRequestContext;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
}): NewFlowArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  return {
    flowVersionId: crypto.randomUUID(),
    type: FlowType.EvolveGroup,
    name: "Evolve group",
    fieldSet: {
      locked: true,
      fields: [
        createSystemFieldDefaults(SystemFieldType.GroupName),
        createSystemFieldDefaults(SystemFieldType.GroupDescription),
        createSystemFieldDefaults(SystemFieldType.GroupMembers),
      ],
    },
    trigger: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
    },
    steps: [createEvolveGroupStepArgs({ groupEntityId, context, policy })],
  };
};

export const createEvolveGroupStepArgs = ({
  groupEntityId,
  context,
  policy,
}: {
  context: GraphqlRequestContext;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
}): NewStepArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  let responseApprovalFieldArgs: FieldArgs | undefined = undefined;
  let approveOptionId: string | undefined = undefined;

  const creatorEntityId = context.currentUser.entityId;
  const approvalField = createApprovalFieldSetArgsForPolicy({
    policy,
  });

  if (approvalField) {
    [responseApprovalFieldArgs, approveOptionId] = approvalField;
  }

  const decisionResult = responseApprovalFieldArgs
    ? createDecisionResultArgsForPolicy({
        policy,
        fieldId: responseApprovalFieldArgs?.fieldId,
      })
    : null;

  const noResponse = policy.type === GroupFlowPolicyType.GroupAutoApprove;

  return {
    stepId: crypto.randomUUID(),
    fieldSet: {
      fields: responseApprovalFieldArgs ? [responseApprovalFieldArgs] : [],
      locked: false,
    },
    response: !noResponse
      ? {
          canBeManuallyEnded: false,
          expirationSeconds: 259200,
          allowMultipleResponses: false,
          minResponses: 1,
          permission: {
            anyone: false,
            entities: [
              {
                id:
                  policy.type === GroupFlowPolicyType.CreatorAutoApprove
                    ? creatorEntityId
                    : groupEntityId,
              },
            ],
          },
        }
      : undefined,
    result: decisionResult ? [decisionResult] : [],
    action: createActionArgsForPolicy({
      actionType: ActionType.EvolveGroup,
      resultConfigId: decisionResult?.resultConfigId,
      optionId: approveOptionId,
    }),
  };
};
