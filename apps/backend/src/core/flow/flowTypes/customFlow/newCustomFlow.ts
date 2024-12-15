import { updateEntityWatchFlows } from "@/core/entity/updateEntityWatchFlow";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { newRequest } from "@/core/request/newRequest";
import { FlowType, MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { newFlow } from "../../newFlow";

export const newCustomFlow = async ({
  args,
  entityContext,
}: {
  args: MutationNewFlowArgs;
  entityContext: UserOrIdentityContextInterface;
}): Promise<string> => {
  const flowId = await prisma.$transaction(async (transaction) => {
    return await newFlow({
      type: FlowType.Custom,
      args: args.newFlow.new,
      entityContext,
      transaction,
    });
  });
  await createWatchFlowRequests({ flowId, entityContext, groupIds: args.newFlow.groupsToWatch });

  if (!args.newFlow.new.reusable) {
    const requestId = crypto.randomUUID();
    await newRequest({
      args: {
        request: {
          requestId,
          flowId: flowId,
          name: args.newFlow.requestName ?? args.newFlow.new.flow.name ?? "",
          requestFields: [],
          requestDefinedOptions: [],
        },
      },
      entityContext,
    });
    return requestId;
  } else {
    // creating a request also watches flow so not calling that for nonreusable flow block
    let entityId: string | undefined;
    if (entityContext.type === "user") entityId = entityContext.context.currentUser?.entityId;
    else if (entityContext.type === "identity") entityId = entityContext.identity.entityId;

    if (entityId) await updateEntityWatchFlows({ flowIds: [flowId], watch: true, entityId });

    return flowId;
  }
};
