import { Prisma } from "@prisma/client";

import { actionConfigInclude } from "../action/actionPrismaTypes";
import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { responseConfigInclude } from "../response/responseConfigPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";

export const stepInclude = Prisma.validator<Prisma.StepInclude>()({
  ResponseConfig: {
    include: responseConfigInclude,
  },
  ResponseFieldSet: {
    include: fieldSetInclude,
  },
  ResultConfigSet: {
    include: resultConfigSetInclude,
  },
  ActionConfigSet: {
    include: {
      ActionConfigs: {
        include: actionConfigInclude,
      },
    },
  },
});

export type StepPrismaType = Prisma.StepGetPayload<{
  include: typeof stepInclude;
}>;

export const entityWatchedFlowsInclude = Prisma.validator<Prisma.EntityWatchedFlowsInclude>()({
  Entity: {
    include: entityInclude,
  },
});

export type EntityWatchedFlowsPrismaType = Prisma.EntityWatchedFlowsGetPayload<{
  include: typeof entityWatchedFlowsInclude;
}>;

export const createFlowVersionInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.FlowVersionInclude>()({
    TriggerFieldSet: {
      include: fieldSetInclude,
    },
    TriggerPermissions: {
      include: permissionInclude,
    },
    Steps: {
      include: stepInclude,
    },
    Flow: {
      // if evolve flow, this will be array of all flow versions managed by that evolveflow
      include: {
        EvolveRightsForFlowVersions: {
          include: {
            Flow: true,
          },
        },
        OwnerGroup: {
          include: groupInclude,
        },
        EntityWatchedFlows: {
          include: entityWatchedFlowsInclude,
          where: {
            OR: [
              { entityId: { in: userEntityIds } },
              { Entity: { Group: { GroupIze: { NOT: undefined } } } },
            ],
            watched: true
          },
        },
      },
    },
  });

const flowVersionExampleInclude = createFlowVersionInclude([]);

export type FlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof flowVersionExampleInclude;
}>;

export const createFlowInclude = (entityIds: string[]) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: createFlowVersionInclude(entityIds),
    },
  });

const flowExampleInclude = Prisma.validator<Prisma.FlowInclude>()({
  CurrentFlowVersion: {
    include: flowVersionExampleInclude,
  },
});

export type FlowPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowExampleInclude;
}>;

export const createFlowSummaryInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: {
        TriggerPermissions: {
          include: permissionInclude,
        },
      },
    },
    CreatorEntity: {
      include: entityInclude,
    },
    OwnerGroup: {
      include: {
        ...groupInclude,
        EntityWatchedGroups: {
          where: {
            entityId: { in: userEntityIds },
            watched: true,
          },
        },
      },
    },
    EntityWatchedFlows: {
      include: entityWatchedFlowsInclude,
      where: {
        OR: [
          { entityId: { in: userEntityIds } },
          { Entity: { Group: { GroupIze: { NOT: undefined } } } },
        ],
        watched: true
      },
    },
  });

export const flowSummaryExampleInclude = createFlowSummaryInclude([]);

export type FlowSummaryPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowSummaryExampleInclude;
}>;
