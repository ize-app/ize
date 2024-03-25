import { Prisma } from "@prisma/client";

export const resultConfigDecisionInclude = Prisma.validator<Prisma.ResultConfigDecisionInclude>()(
  {},
);

export type ResultConfigDecisionPrismaType = Prisma.ResultConfigDecisionGetPayload<{
  include: typeof resultConfigDecisionInclude;
}>;

export const resultConfigRankInclude = Prisma.validator<Prisma.ResultConfigRankInclude>()({});

export type ResultConfigRankPrismaType = Prisma.ResultConfigRankGetPayload<{
  include: typeof resultConfigRankInclude;
}>;

export const resultConfigLlmInclude = Prisma.validator<Prisma.ResultConfigLlmInclude>()({});

export type ResultConfigLlmPrismaType = Prisma.ResultConfigLlmGetPayload<{
  include: typeof resultConfigLlmInclude;
}>;

export const resultConfigInclude = Prisma.validator<Prisma.ResultConfigInclude>()({
  ResultConfigDecision: {
    include: resultConfigDecisionInclude,
  },
  ResultConfigRank: {
    include: resultConfigRankInclude,
  },
  ResultConfigLlm: {
    include: resultConfigLlmInclude,
  },
});

export type ResultConfigPrismaType = Prisma.ResultConfigGetPayload<{
  include: typeof resultConfigInclude;
}>;

export const resultConfigSetInclude = Prisma.validator<Prisma.ResultConfigSetInclude>()({
  ResultConfigSetResultConfigs: {
    include: {
      ResultConfig: {
        include: resultConfigInclude,
      },
    },
  },
});

export type ResultConfigSetPrismaType = Prisma.ResultConfigSetGetPayload<{
  include: typeof resultConfigSetInclude;
}>;

export const resultInclude = Prisma.validator<Prisma.ResultInclude>()({
  ResultItems: true,
});

export type ResultPrismaType = Prisma.ResultGetPayload<{
  include: typeof resultInclude;
}>;
