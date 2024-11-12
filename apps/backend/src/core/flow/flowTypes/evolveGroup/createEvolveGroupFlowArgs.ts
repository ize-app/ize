import { SystemFieldType } from "@prisma/client";
import { GraphQLError } from "graphql";

import { systemFieldDefaults } from "@/core/fields/systemFieldDefaults";
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
} from "@/graphql/generated/resolver-types";

import { createActionArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createActionArgsForPolicy";
import { createApprovalFieldSetArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createApprovalFieldSetArgsForPolicy";
import { createDecisionResultArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createDecisionResultArgsForPolicy";

const requestFieldSetArgs: FieldArgs[] = [
  systemFieldDefaults[SystemFieldType.GroupName],
  systemFieldDefaults[SystemFieldType.GroupDescription],
  systemFieldDefaults[SystemFieldType.GroupMembers],
];

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
    type: FlowType.EvolveGroup,
    name: "Evolve group",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
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

  const creatorEntityId = context.currentUser.entityId;
  const responseApprovalFieldArgs: FieldArgs | undefined = createApprovalFieldSetArgsForPolicy({
    policy,
  });

  const decisionResult = createDecisionResultArgsForPolicy({ policy });

  const noResponse = policy.type === GroupFlowPolicyType.GroupAutoApprove;

  return {
    fieldSet: {
      fields: responseApprovalFieldArgs ? [responseApprovalFieldArgs] : [],
      locked: false,
    },
    response: !noResponse
      ? {
          canBeManuallyEnded: false,
          expirationSeconds: 259200,
          allowMultipleResponses: false,
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
    action: createActionArgsForPolicy({ actionType: ActionType.EvolveGroup, policy }),
  };
};
