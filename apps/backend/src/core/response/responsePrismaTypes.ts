import { Prisma } from "@prisma/client";
import { userInclude } from "../user/userPrismaTypes";

export const responseInclude = Prisma.validator<Prisma.ResponseNewInclude>()({
  Answers: {
    include: {
      AnswerOptionSelections: true,
      AnswerFreeInput: true,
    },
  },
  User: {
    include: userInclude
  }
});

export type ResponsePrismaType = Prisma.ResponseNewGetPayload<{
  include: typeof responseInclude;
}>;
