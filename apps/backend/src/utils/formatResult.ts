import { Prisma } from "@prisma/client";
import { Result, ProcessOption } from "@graphql/generated/resolver-types";

export const resultInclude = Prisma.validator<Prisma.ResultInclude>()({
  actionAttempts: true,
});

type ResultPrismaType = Prisma.ResultGetPayload<{
  include: typeof resultInclude;
}>;

export const formatResult = (
  result: ResultPrismaType | null,
  availableOptions: ProcessOption[],
): Result | null => {
  if (!result) return null;

  let selectedOption: ProcessOption | null = null;

  const actionComplete = result.actionAttempts.findIndex((attempt) => attempt.success) !== -1;

  for (let i = 0; i <= availableOptions.length - 1; i++) {
    if (availableOptions[i].id === result.optionId) {
      selectedOption = availableOptions[i];
      break;
    }
  }

  if (!selectedOption) throw Error("ERROR formatResult: Cannot find selected Option");

  return {
    id: result.id,
    createdAt: result.createdAt.toString(),
    selectedOption,
    actionComplete,
  };
};
