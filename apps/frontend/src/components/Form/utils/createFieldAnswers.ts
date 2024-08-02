import { Dayjs } from "dayjs";

import {
  Entity,
  FieldAnswerArgs,
  FieldDataType,
  FlowSummaryFragment,
} from "@/graphql/generated/graphql";

import { createCallWebhookArgs } from "../FlowForm/helpers/createNewFlowArgs/createActionArgs";
import { FieldAnswerRecordSchemaType, FieldAnswerSchemaType } from "../formValidation/field";
import { WebhookSchemaType } from "../formValidation/webhook";

export const createFieldAnswersArgs = (
  fieldAnswers: FieldAnswerRecordSchemaType | undefined,
): FieldAnswerArgs[] => {
  return Object.entries((fieldAnswers ?? []) as FieldAnswerRecordSchemaType)
    .map(
      (entry): FieldAnswerArgs => ({
        fieldId: entry[0],
        value: formatAnswerValue(entry[1]),
        optionSelections: entry[1].optionSelections ?? [],
      }),
    )
    .filter((f) => f.value || (f.optionSelections ?? []).length > 0);
};

const formatAnswerValue = (fieldAnswer: FieldAnswerSchemaType) => {
  if (fieldAnswer.value) {
    switch (fieldAnswer.dataType) {
      case FieldDataType.Date:
        return (fieldAnswer.value as Dayjs).utc().format("YYYY-MM-DD"); // 2019-03-06
      case FieldDataType.DateTime:
        return (fieldAnswer.value as Dayjs).utc().format(); // 2019-03-06T00:00:00Z
      case FieldDataType.EntityIds:
        return JSON.stringify((fieldAnswer.value as Entity[]).map((e) => e.entityId));
      case FieldDataType.FlowIds:
        return JSON.stringify((fieldAnswer.value as FlowSummaryFragment[]).map((f) => f.flowId));
      case FieldDataType.Webhook:
        return JSON.stringify(createCallWebhookArgs(fieldAnswer.value as WebhookSchemaType));
      default:
        return fieldAnswer.value;
    }
  }
  return null;
};
