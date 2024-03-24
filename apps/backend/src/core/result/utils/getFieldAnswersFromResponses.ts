import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";

// gets all answers for a particular field from a list of responses
export const getFieldAnswersFromResponses = ({
  fieldId,
  responses,
}: {
  fieldId: string;
  responses: ResponsePrismaType[];
}): FieldAnswerPrismaType[] => {
  const fieldAnswers: FieldAnswerPrismaType[] = [];
  responses.forEach((r) => {
    r.Answers.forEach((a) => {
      if (a.fieldId === fieldId) fieldAnswers.push(a);
    });
  });
  return fieldAnswers;
};
