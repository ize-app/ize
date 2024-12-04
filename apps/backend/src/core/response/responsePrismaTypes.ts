import { Prisma } from "@prisma/client";

import { entityInclude } from "../entity/entityPrismaTypes";
import { fieldAnswerInclude } from "../fields/fieldPrismaTypes";

export const responseInclude = Prisma.validator<Prisma.ResponseInclude>()({
  Answers: {
    include: fieldAnswerInclude,
  },
  CreatorEntity: {
    include: entityInclude,
  },
});

export type ResponsePrismaType = Prisma.ResponseGetPayload<{
  include: typeof responseInclude;
}>;
