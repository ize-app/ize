import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { fieldAnswerResolver } from "@/core/fields/resolvers/fieldAnswerResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import {
  Entity,
  Field,
  TriggerFieldAnswer,
  UserFieldAnswer,
} from "@/graphql/generated/resolver-types";

export const triggerFieldAnswersResolver = async ({
  fields,
  answers,
  creator,

  context,
}: {
  fields: Field[];
  answers: FieldAnswerPrismaType[];
  creator: Entity;
  context: GraphqlRequestContext;
}): Promise<TriggerFieldAnswer[]> => {
  return await Promise.all(
    fields.map(async (field) => {
      const answer = answers.find((answer) => answer.fieldId === field.fieldId);

      const userFieldAnswer: UserFieldAnswer | null = answer
        ? {
            creator,
            createdAt: answer.createdAt.toISOString(),
            answer: await fieldAnswerResolver({
              fieldAnswer: answer,
              context,
            }),
          }
        : null;

      return {
        field,
        answer: userFieldAnswer,
      };
    }),
  );
};
