import { Request } from "@/graphql/generated/resolver-types";

import { FieldAndValues, stringifyFieldsAndValues } from "./stringifyFieldAndValues";

export const stringifyTriggerFields = ({
  request,
  title,
  type,
}: {
  request: Request;
  title?: string;
  type: "html" | "markdown";
}): string => {
  const fieldsAndValues: FieldAndValues[] = [];
  request.flow.fieldSet.fields.forEach((field) => {
    const triggerFieldAnswer = request.triggerFieldAnswers.find(
      (fa) => fa.field.fieldId === field.fieldId,
    );
    const answer = triggerFieldAnswer?.answer;
    if (!answer) return;

    fieldsAndValues.push({ field: field.name, value: answer });
  });

  return stringifyFieldsAndValues({ title, fieldsAndValues, type });
};
