import { createFlowInclude } from "@/core/flow/flowPrismaTypes";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { FlowType, MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { createRequestDefinedOptionSet } from "./createRequestDefinedOptionSet";
import { GraphqlRequestContext } from "../../graphql/context";
import { executeAction } from "../action/executeActions/executeAction";
import { entityInclude } from "../entity/entityPrismaTypes";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { sendNewStepNotifications } from "../notification/sendNewStepNotifications";
import { hasWriteUserPermission } from "../permission/hasWritePermission";
import { getUserEntityIds } from "../user/getUserEntityIds";
import { watchFlow } from "../user/watchFlow";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newRequest = async ({
  args,
  context,
  // proposed flow version id is used when creating an evolution request
  proposedFlowVersionId,
}: {
  args: MutationNewRequestArgs;
  context: GraphqlRequestContext;
  proposedFlowVersionId?: string;
}): Promise<string> => {
  const {
    request: { requestDefinedOptions, requestFields, flowId },
  } = args;

  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const user = context.currentUser;

  const userEntityIds = getUserEntityIds(user);

  const [requestId, requestStepId, executeActionAutomatically] = await prisma.$transaction(
    async (transaction) => {
      const flow = await transaction.flow.findUniqueOrThrow({
        where: {
          id: flowId,
        },
        include: createFlowInclude(userEntityIds),
      });

      if (!context.currentUser)
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: CustomErrorCodes.Unauthenticated },
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

      const hasRequestPermission = await hasWriteUserPermission({
        permission: step.RequestPermissions,
        context,
        transaction,
      });

      if (!hasRequestPermission)
        throw new GraphQLError("User does not have permission to respond", {
          extensions: { code: CustomErrorCodes.InsufficientPermissions },
        });

      const request = await transaction.request.create({
        include: {
          CreatorEntity: {
            include: entityInclude,
          },
        },
        data: {
          name: args.request.name,
          flowVersionId: flow.CurrentFlowVersion.id,
          creatorEntityId: context.currentUser.entityId,
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

  await watchFlow({ flowId: flowId, watch: true, entityId: user.entityId, user });

  await sendNewStepNotifications({
    flowId: flowId,
    requestStepId,
  });

  return requestId;
};
