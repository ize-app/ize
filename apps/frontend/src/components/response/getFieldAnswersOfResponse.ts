import { FieldAnswerFragment, ResponseFragment } from "@/graphql/generated/graphql";

export const getFieldAnswersOfResponse = async (
  response: ResponseFragment[],
  fieldId: string,
): Promise<FieldAnswerFragment[]> => {
  const fieldAnswers: FieldAnswerFragment[] = [];

  for (const res of response) {
    const { answers } = res;
    for (const answer of answers) {
      if (answer.fieldId === fieldId) {
        fieldAnswers.push(answer);
      }
    }
  }

  return fieldAnswers;
};
