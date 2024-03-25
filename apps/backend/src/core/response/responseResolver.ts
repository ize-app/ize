import { Response } from "@/graphql/generated/resolver-types";
import { ResponsePrismaType } from "./responsePrismaTypes";
import { fieldAnswerResolver } from "../fields/resolvers/fieldAnswerResolver";
import { userResolver } from "../user/userResolver";

export const responsesResolver = (responses: ResponsePrismaType[]): Response[] => {
  return responses.map((response) => {
    return {
      responseId: response.id,
      createdAt: response.createdAt.toISOString(),
      user: userResolver(response.User),
      answers: response.Answers.map((a) => fieldAnswerResolver({ fieldAnswer: a })),
    };
  });
};
