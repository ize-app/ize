import { Response, UserFieldAnswer, UserFieldAnswers } from "@/graphql/generated/resolver-types";

import { ResponsePrismaType } from "./responsePrismaTypes";
import { entityResolver } from "../entity/entityResolver";
import { fieldAnswerResolver } from "../fields/resolvers/fieldAnswerResolver";

export const responsesResolver = async (
  responses: ResponsePrismaType[],
  userId: string | null | undefined,
): Promise<[UserFieldAnswers[], Response[]]> => {
  const fieldAnswers: { [key: string]: UserFieldAnswer[] } = {};
  const userResponses: Response[] = [];

  await Promise.all(
    responses.map(async (response) => {
      const { createdAt, CreatorEntity, Answers } = response;
      const creator = entityResolver({ entity: CreatorEntity });
      // if (userId && userId === user.id)
      userResponses.push({
        responseId: response.id,
        createdAt: response.createdAt.toISOString(),
        creator,
        answers: await Promise.all(
          response.Answers.map(
            async (a) => await fieldAnswerResolver({ fieldAnswer: a, userId: userId ?? undefined }),
          ),
        ),
      });

      await Promise.all(
        Answers.map(async (a) => {
          const { fieldId } = a;
          const answer = await fieldAnswerResolver({ fieldAnswer: a, userId: userId ?? undefined });
          const payload: UserFieldAnswer = {
            answer,
            creator,
            createdAt: createdAt.toISOString(),
          };
          if (fieldAnswers[fieldId]) fieldAnswers[fieldId].push(payload);
          else fieldAnswers[fieldId] = [payload];
        }),
      );
    }),
  );

  const userFieldAnswers: UserFieldAnswers[] = Object.keys(fieldAnswers).map((key) => ({
    fieldId: key,
    answers: fieldAnswers[key],
  }));

  return [userFieldAnswers, userResponses];
};
