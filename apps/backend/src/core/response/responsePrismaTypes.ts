import { Prisma } from "@prisma/client";

import { userInclude } from "../user/userPrismaTypes";

export const responseInclude = Prisma.validator<Prisma.ResponseInclude>()({
  Answers: {
    include: {
      AnswerOptionSelections: true,
      AnswerFreeInput: true,
    },
  },
  User: {
    include: userInclude,
  },
});

export type ResponsePrismaType = Prisma.ResponseGetPayload<{
  include: typeof responseInclude;
}>;
