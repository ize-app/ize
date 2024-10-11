import { FlowType } from "@prisma/client";

import { prisma } from "@/prisma/client";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { newRequest } from "./newRequest";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { GroupWatchFlowFields } from "../flow/groupWatchFlows/GroupWatchFlowFields";
import { PermissionPrismaType, permissionInclude } from "../permission/permissionPrismaTypes";

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

    const customGroups: Map<string, boolean> = new Map();

    const getCustomGroups = (permissions: PermissionPrismaType | null) => {
      (permissions?.EntitySet?.EntitySetEntities ?? []).forEach((entity) => {
        const customGroup = entity.Entity.Group?.GroupCustom;
        if (customGroup) customGroups.set(customGroup.groupId, true);
      });
    };

    data.CurrentFlowVersion?.Steps.forEach((step) => {
      getCustomGroups(step.RequestPermissions);
      getCustomGroups(step.ResponsePermissions);
    });

    // find "watch flow" flows for all of these custom groups
    const watchFlows = await prisma.flow.findMany({
      where: { groupId: { in: Array.from(customGroups.keys()) }, type: FlowType.GroupWatchFlow },
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
    watchFlows.forEach((flow) => {
      try {
        const watchFlowField =
          flow.CurrentFlowVersion?.Steps[0].RequestFieldSet?.FieldSetFields.find(
            (field) => field.Field.name === (GroupWatchFlowFields.WatchFlow as string),
          );

        if (!watchFlowField) return;

        newRequest({
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
    });
  } catch (e) {
    console.log(`createWatchFlowRequests Error:  Error watching flow Id ${flowId}`, e);
  }
};
