import { Prisma } from "@prisma/client";

import { identityInclude } from "../entity/identity/identityPrismaTypes";
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
  Identity: {
    include: identityInclude,
  },
});

export type ResponsePrismaType = Prisma.ResponseGetPayload<{
  include: typeof responseInclude;
}>;
