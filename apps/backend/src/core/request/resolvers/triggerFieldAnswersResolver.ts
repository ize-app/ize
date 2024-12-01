import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { valueResolver } from "@/core/value/valueResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, TriggerFieldAnswer } from "@/graphql/generated/resolver-types";

export const triggerFieldAnswersResolver = ({
  fields,
  answers,
  context,
}: {
  fields: Field[];
  answers: FieldAnswerPrismaType[];
  context: GraphqlRequestContext;
}): TriggerFieldAnswer[] => {
  return fields
    .map((field) => {
      const answer = answers.find((answer) => answer.fieldId === field.fieldId);
      if (!answer) return null;
      return {
        field,
        answer: valueResolver({ type: "default", value: answer.Value, context }),
      };
    })
    .filter((answer) => !!answer);
};
