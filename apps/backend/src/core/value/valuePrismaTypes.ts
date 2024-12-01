import { Prisma } from "@prisma/client";

import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";

export const valueBaseInclude = Prisma.validator<Prisma.ValueInclude>()({
  ValueFlows: {
    include: {
      Flow: {
        include: {
          CurrentFlowVersion: true,
          OwnerGroup: {
            include: groupInclude,
          },
        },
      },
    },
  },
  ValueEntities: {
    include: {
      Entity: {
        include: entityInclude,
      },
    },
  },
  FlowVersion: {
    include: {
      Flow: {
        include: {
          OwnerGroup: {
            include: groupInclude,
          },
        },
      },
    },
  },
});

export const valueInclude = Prisma.validator<Prisma.ValueInclude>()({
  ...valueBaseInclude,
  ValueOptionSelections: {
    include: {
      Option: {
        include: {
          Value: {
            include: valueBaseInclude,
          },
        },
      },
    },
  },
});

export type OptionValuePrismaType = Prisma.ValueGetPayload<{
  include: typeof valueBaseInclude;
}>;

export type ValuePrismaType = Prisma.ValueGetPayload<{
  include: typeof valueInclude;
}>;
