import { FlowType } from "@prisma/client";

import { SystemFieldType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { newRequest } from "./newRequest";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";

// creates watch flow requests for a flow for a set of groups
export const createWatchFlowRequests = async ({
  flowId,
  groupIds, // Ids of Ize groups to watch the flow
  entityContext,
}: {
  flowId: string;
  groupIds: string[];
  entityContext: UserOrIdentityContextInterface;
}) => {
  try {
    // Find all entities referenced on this flow
    const flow = await prisma.flow.findUniqueOrThrow({
      include: {
        CurrentFlowVersion: true,
      },
      where: {
        id: flowId,
      },
    });

    const flowName = flow.CurrentFlowVersion?.name;

    // find "watch flow" flows for all of these custom groups
    const watchFlows = await prisma.flow.findMany({
      where: {
        groupId: { in: groupIds },
        type: FlowType.GroupWatchFlow,
      },
      include: {
        CurrentFlowVersion: {
          include: {
            TriggerFieldSet: {
              include: fieldSetInclude,
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
          const watchFlowField = (flow.CurrentFlowVersion?.TriggerFieldSet?.Fields ?? []).find(
            (field) => field.systemType === SystemFieldType.WatchFlow,
          );

          if (!watchFlowField) return;

          await newRequest({
            args: {
              request: {
                requestId: crypto.randomUUID(),
                name: flowName ? `Watch '${flowName}'` : "Watch flow",
                requestDefinedOptions: [],
                requestFields: [{ fieldId: watchFlowField.id, value: fieldAnswerValue }],
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
