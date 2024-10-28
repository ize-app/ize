import { Prisma } from "@prisma/client";

import { entityInclude } from "../entity/entityPrismaTypes";

export const responseInclude = Prisma.validator<Prisma.ResponseInclude>()({
  Answers: {
    include: {
      AnswerOptionSelections: true,
      AnswerFreeInput: true,
    },
  },
  CreatorEntity: {
    include: entityInclude,
  },
});

export type ResponsePrismaType = Prisma.ResponseGetPayload<{
  include: typeof responseInclude;
}>;
