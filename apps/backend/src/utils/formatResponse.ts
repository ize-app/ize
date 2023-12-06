import { Prisma } from "@prisma/client";
import { userInclude, formatUser } from "./formatUser";

import {
  Response,
  ResponseCount,
  Responses,
  ProcessOption,
  OptionType,
} from "@graphql/generated/resolver-types";

export const responseInclude = Prisma.validator<Prisma.ResponseInclude>()({
  creator: {
    include: userInclude,
  },
  option: true,
});

type ResponsePrismaType = Prisma.ResponseGetPayload<{
  include: typeof responseInclude;
}>;

const formatResponse = (response: ResponsePrismaType): Response => ({
  optionId: response.optionId,
  value: response.option.value,
  type: response.option.type as OptionType,
  createdAt: response.createdAt.toString(),
  user: formatUser(response.creator),
});

export const formatResponses = (
  responses: ResponsePrismaType[],
  options: ProcessOption[],
  userId?: string,
): Responses => {
  let userResponse;
  const allResponses: Response[] = [];
  const responseCount: ResponseCount[] = options.map((option) => ({
    optionId: option.id,
    value: option.value,
    type: option.type,
    count: 0,
  }));

  for (let i = 0; i <= responses.length - 1; i++) {
    const formattedResponse = formatResponse(responses[i]);
    allResponses.push(formattedResponse);
    responseCount.find(
      (option) => option.optionId === formattedResponse.optionId,
    ).count++;
    if (userId && formattedResponse.user.id === userId)
      userResponse = formattedResponse;
  }
  return { userResponse, allResponses, responseCount };
};
