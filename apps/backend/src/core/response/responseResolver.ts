import { GraphQLError } from "graphql";

import { ApolloServerErrorCode } from "@/graphql/errors";
import { Response, UserFieldAnswer, UserFieldAnswers } from "@/graphql/generated/resolver-types";

import { ResponsePrismaType } from "./responsePrismaTypes";
import { identityResolver } from "../entity/identity/identityResolver";
import { fieldAnswerResolver } from "../fields/resolvers/fieldAnswerResolver";
import { userResolver } from "../user/userResolver";

export const responsesResolver = async (
  responses: ResponsePrismaType[],
  userId: string | null | undefined,
): Promise<[UserFieldAnswers[], Response[]]> => {
  const fieldAnswers: { [key: string]: UserFieldAnswer[] } = {};
  const userResponses: Response[] = [];

  await Promise.all(
    responses.map(async (response) => {
      const { createdAt, User, Identity, Answers } = response;
      const user = User ? userResolver(User) : null;
      const identity = Identity ? identityResolver(Identity, []) : null;
      const creator = user ?? identity;
      if (!creator)
        throw new GraphQLError("Missing creator of response", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      // if (userId && userId === user.id)
      userResponses.push({
        responseId: response.id,
        createdAt: response.createdAt.toISOString(),
        creator: creator,
        answers: await Promise.all(
          response.Answers.map(
            async (a) => await fieldAnswerResolver({ fieldAnswer: a, userId: user?.id }),
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
