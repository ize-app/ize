import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import {
  ActionArgs,
  ActionType,
  DecisionType,
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  NewStepArgs,
  ResultArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

import { GroupNotificationsFields } from "./GroupNotificationsFields";

export const createGroupUpdateNotificationsFlowVersionArgs = ({
  groupEntityId,
  context,
}: {
  context: GraphqlRequestContext;
  groupEntityId: string;
}): NewStepArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const requestFieldSetArgs: FieldArgs[] = [
    {
      type: FieldType.FreeInput,
      fieldId: "webhook",
      freeInputDataType: FieldDataType.Webhook,
      name: GroupNotificationsFields.Webhook,
      required: true,
    },
  ];

  const responseFieldSetArgs: FieldArgs = {
    type: FieldType.Options,
    fieldId: "new",
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      previousStepOptions: false,
      maxSelections: 1,
      selectionType: FieldOptionsSelectionType.Select,
      linkedResultOptions: [],
      options: [
        { optionId: "approve", dataType: FieldDataType.String, name: "✅" },
        { optionId: "deny", dataType: FieldDataType.String, name: "❌" },
      ],
    },
  };

  const resultArgs: ResultArgs = {
    type: ResultType.Decision,
    decision: { type: DecisionType.NumberThreshold, threshold: 1 },
    responseFieldIndex: 0,
    minimumAnswers: 1,
  };

  const actionArgs: ActionArgs = {
    type: ActionType.GroupUpdateNotifications,
    filterResponseFieldIndex: 0,
    filterOptionIndex: 0,
    locked: true,
  };

  return {
    allowMultipleResponses: false,
    request: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
      fields: requestFieldSetArgs,
      fieldsLocked: true,
    },
    response: {
      permission: {
        anyone: false,
        entities: [{ id: context.currentUser.Identities[0].entityId }],
      },
      fields: [responseFieldSetArgs],
    },
    expirationSeconds: 259200,
    result: [resultArgs],
    action: actionArgs,
  };
};
