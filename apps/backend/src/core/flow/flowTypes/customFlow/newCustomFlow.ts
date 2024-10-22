import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { createWatchFlowRequests } from "@/core/request/createWatchFlowRequests";
import { newRequest } from "@/core/request/newRequest";
import { watchFlow } from "@/core/user/watchFlow";
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
  const { entityId, user } = await getUserEntities({ entityContext });
  const flowId = await prisma.$transaction(async (transaction) => {
    return await newFlow({ type: FlowType.Custom, args: args.flow, entityContext, transaction });
  });
  await createWatchFlowRequests({ flowId, entityContext });
  
  if (!args.flow.reusable) {
    const requestId = await newRequest({
      args: {
        request: {
          flowId: flowId,
          name: args.flow.requestName ?? args.flow.name ?? "",
          requestFields: [],
          requestDefinedOptions: [],
        },
      },
      entityContext,
    });
    return requestId;
  } else {
    // creating a request also watches flow so not calling that for nonreusable flow block
    await watchFlow({ flowId, watch: true, entityId, user });
    return flowId;
  }
};
