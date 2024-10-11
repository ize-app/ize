import { FlowType } from "@prisma/client";

import { prisma } from "@/prisma/client";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { newRequest } from "./newRequest";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { GroupWatchFlowFields } from "../flow/flowTypes/groupWatchFlows/GroupWatchFlowFields";
import { PermissionPrismaType, permissionInclude } from "../permission/permissionPrismaTypes";

// creates watch flow requests for a flow
// assumption here is that creator of a flow would want to create watch flow requests for all custom groups where
// 1) this custom group participating on the flow (via respond / request permissions)
// 2) this particular entity has permissions to request the "watch flow" flow
export const createWatchFlowRequests = async ({
  flowId,
  entityContext,
}: {
  flowId: string;
  entityContext: UserOrIdentityContextInterface;
}) => {
  try {
    // Find all entities referenced on this flow
    const data = await prisma.flow.findUniqueOrThrow({
      include: {
        CurrentFlowVersion: {
          include: {
            Steps: {
              include: {
                RequestPermissions: { include: permissionInclude },
                ResponsePermissions: { include: permissionInclude },
              },
            },
          },
        },
      },
      where: {
        id: flowId,
      },
    });

    const flowName = data.CurrentFlowVersion?.name;

    const entitiesOnFlow: Set<string> = new Set();

    // get all entities referenced on this flow
    const getCustomGroups = (permissions: PermissionPrismaType | null) => {
      (permissions?.EntitySet?.EntitySetEntities ?? []).forEach((entity) => {
        entitiesOnFlow.add(entity.entityId);
      });
    };

    data.CurrentFlowVersion?.Steps.forEach((step) => {
      getCustomGroups(step.RequestPermissions);
      getCustomGroups(step.ResponsePermissions);
    });

    const customGroups = await prisma.groupCustom.findMany({
      where: {
        MemberEntitySet: {
          EntitySetEntities: {
            some: { entityId: { in: Array.from(entitiesOnFlow) } },
          },
        },
      },
    });

    // find "watch flow" flows for all of these custom groups
    const watchFlows = await prisma.flow.findMany({
      where: {
        groupId: { in: customGroups.map((group) => group.groupId) },
        type: FlowType.GroupWatchFlow,
      },
      include: {
        CurrentFlowVersion: {
          include: {
            Steps: {
              include: {
                RequestFieldSet: {
                  include: fieldSetInclude,
                },
              },
            },
          },
        },
      },
    });

    const fieldAnswerValue = JSON.stringify([flowId]);

    // create request for each watchFlow
    // if user doesn't have permissions to create watchFlow request, fail silently
    await Promise.all(
      watchFlows.map(async (flow) => {
        try {
          const watchFlowField =
            flow.CurrentFlowVersion?.Steps[0].RequestFieldSet?.FieldSetFields.find(
              (field) => field.Field.name === (GroupWatchFlowFields.WatchFlow as string),
            );

          if (!watchFlowField) return;

          await newRequest({
            args: {
              request: {
                name: flowName ? `Watch '${flowName}'` : "Watch flow",
                requestDefinedOptions: [],
                requestFields: [{ fieldId: watchFlowField.fieldId, value: fieldAnswerValue }],
                flowId: flow.id,
              },
            },
            entityContext,
          });
        } catch (e) {
          // fail silently if insufficient permissions
          if (
            e instanceof GraphQLError &&
            e.extensions?.code === CustomErrorCodes.InsufficientPermissions
          )
            return;

          console.log(
            `createWatchFlowRequests ERROR: Error watching flow Id ${flowId} via GroupWatchFlow flow Id ${flow.id}`,
            e,
          );
        }
      }),
    );
  } catch (e) {
    console.log(`createWatchFlowRequests Error:  Error watching flow Id ${flowId}`, e);
  }
};
