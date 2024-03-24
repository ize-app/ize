import { Prisma } from "@prisma/client";

export const responseInclude = Prisma.validator<Prisma.ResponseNewInclude>()({
  Answers: {
    include: {
      AnswerOptionSelections: true,
      AnswerFreeInput: true,
    },
  },
});

export type ResponsePrismaType = Prisma.ResponseNewGetPayload<{
  include: typeof responseInclude;
}>;
