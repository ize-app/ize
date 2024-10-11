import { createFlowInclude } from "@/core/flow/flowPrismaTypes";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { FlowType, MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { createRequestDefinedOptionSet } from "./createRequestDefinedOptionSet";
import { executeAction } from "../action/executeActions/executeAction";
import { entityInclude } from "../entity/entityPrismaTypes";
import { getUserEntities } from "../entity/getUserEntities";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { sendNewStepNotifications } from "../notification/sendNewStepNotifications";
import { getEntityPermissions } from "../permission/getEntityPermissions";
import { watchFlow } from "../user/watchFlow";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newRequest = async ({
  args,
  entityContext,
  // proposed flow version id is used when creating an evolution request
  proposedFlowVersionId,
}: {
  args: MutationNewRequestArgs;
  entityContext: UserOrIdentityContextInterface;
  proposedFlowVersionId?: string;
}): Promise<string> => {
  const {
    request: { requestDefinedOptions, requestFields, flowId },
  } = args;

  const { entityId, entityIds, user } = await getUserEntities({ entityContext });

  const flow = await prisma.flow.findUniqueOrThrow({
    where: {
      id: flowId,
    },
    include: createFlowInclude(entityIds),
  });

  if (!flow.CurrentFlowVersion)
    throw new GraphQLError("Missing current version of flow", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (flow.type === FlowType.Evolve && !proposedFlowVersionId)
    throw new GraphQLError(
      `Request for evolve flow id ${flow.id} is missing proposedFlowVersionId`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  const step = flow.CurrentFlowVersion.Steps[0];
  const flowVersionId = flow.CurrentFlowVersion.id;

  const hasRequestPermission = await getEntityPermissions({
    entityContext,
    permission: step.RequestPermissions,
  });

  if (!hasRequestPermission)
    throw new GraphQLError("User does not have permission to request", {
      extensions: { code: CustomErrorCodes.InsufficientPermissions },
    });

  const [requestId, requestStepId, executeActionAutomatically] = await prisma.$transaction(
    async (transaction) => {
      const request = await transaction.request.create({
        include: {
          CreatorEntity: {
            include: entityInclude,
          },
        },
        data: {
          name: args.request.name,
          flowVersionId: flowVersionId,
          creatorEntityId: entityId,
          proposedFlowVersionId,
          final: false,
        },
      });

      const executeActionAutomatically = !step.ResponseFieldSet;

      const requestStep = await transaction.requestStep.create({
        data: {
          expirationDate: new Date(
            new Date().getTime() + (step.expirationSeconds as number) * 1000,
          ),
          responseFinal: executeActionAutomatically,
          resultsFinal: executeActionAutomatically,
          Request: {
            connect: {
              id: request.id,
            },
          },
          Step: {
            connect: {
              id: step.id,
            },
          },
          CurrentStepParent: {
            connect: {
              id: request.id,
            },
          },
        },
      });

      const requestDefinedOptionSets = await Promise.all(
        requestDefinedOptions.map(async (r) => {
          return await createRequestDefinedOptionSet({
            step,
            requestStepId: requestStep.id,
            newOptionArgs: r.options,
            fieldId: r.fieldId,
            isTriggerDefinedOptions: true,
            transaction,
          });
        }),
      );

      // TODO: if auto approve, just create the result

      await newFieldAnswers({
        fieldSet: step.RequestFieldSet,
        fieldAnswers: requestFields,
        requestDefinedOptionSets: requestDefinedOptionSets,
        requestStepId: requestStep.id,
        transaction,
      });

      return [request.id, requestStep.id, executeActionAutomatically];
    },
  );

  if (executeActionAutomatically) {
    await executeAction({ requestStepId: requestStepId });
  }

  await watchFlow({ flowId: flowId, watch: true, entityId, user });

  await sendNewStepNotifications({
    flowId: flowId,
    requestStepId,
  });

  return requestId;
};
