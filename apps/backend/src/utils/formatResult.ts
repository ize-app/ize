import { Prisma } from "@prisma/client";
import { Result, ProcessOption } from "frontend/src/graphql/generated/graphql";

export const resultInclude = Prisma.validator<Prisma.ResultInclude>()({});

type ResultPrismaType = Prisma.ResultGetPayload<{
  include: typeof resultInclude;
}>;

export const formatResult = (
  result: ResultPrismaType | null,
  availableOptions: ProcessOption[],
): Result => {
  if (!result) return null;
  let selectedOption: ProcessOption;

  for (let i = 0; i <= availableOptions.length - 1; i++) {
    if (availableOptions[i].id === result.id) {
      selectedOption = availableOptions[i];
      break;
    }
  }
  return { createdAt: result.createdAt.toString(), selectedOption };
};
