import { ResponseFieldAnswers, UserFieldAnswer } from "@/graphql/generated/resolver-types";

import { stringifyValue } from "./stringifyInput";

export const stringifyFieldResponses = ({
  fieldAnswers,
}: {
  fieldAnswers: ResponseFieldAnswers[];
}) => {
  return fieldAnswers
    .map((fieldAnswer) => stringifyFieldResponse({ fieldAnswers: fieldAnswer }))
    .join("\n\n");
};

const stringifyFieldResponse = ({ fieldAnswers }: { fieldAnswers: ResponseFieldAnswers }) => {
  if (fieldAnswers.answers.length === 0) {
    return "";
  }
  const formattedAnswers = fieldAnswers.answers
    .map((answer) => {
      return `- ${stringifyFieldAnswer({ userFieldAnswer: answer })}`;
    })
    .join("\n");
  return `Question: ${fieldAnswers.field.name} \nAnswers: \n${formattedAnswers}`;
};

const stringifyFieldAnswer = ({
  userFieldAnswer,
}: {
  userFieldAnswer: UserFieldAnswer;
}): string => {
  const answer = userFieldAnswer.answer;
  return `${userFieldAnswer.creator.name}: ${stringifyValue(answer)}`;
};
