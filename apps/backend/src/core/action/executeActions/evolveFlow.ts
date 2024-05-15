import { EvolveFlowFields } from "@/core/flow/helpers/EvolveFlowFields";
import { prisma } from "../../../prisma/client";
import { FieldDataType, Prisma } from "@prisma/client";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const evolveFlow = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  try {
    // find the current / proposed fields in the request
    const requestStep = await transaction.requestStep.findFirstOrThrow({
      include: {
        RequestFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
      },
      where: {
        id: requestStepId,
      },
    });

    const proposedFlowField = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      fieldAnswer.Field.name === EvolveFlowFields.ProposedFlow;
    });

    if (!proposedFlowField)
      throw new GraphQLError(`Cannot find requestStepId ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    if (
      proposedFlowField.type !== "FreeInput" ||
      proposedFlowField.Field.freeInputDataType !== FieldDataType.FlowVersionId
    )
      throw new GraphQLError(
        `Field id ${proposedFlowField.Field.id} is the incorrect type for an evolve request`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    // make proposed the current_flow_version_id and switch it's status to draft = false

    const proposedFlowVersion = await transaction.flowVersion.findFirstOrThrow({
      where: { id: proposedFlowField.AnswerFreeInput[0].value },
    });

    await transaction.flowVersion.update({
      where: { id: proposedFlowField.AnswerFreeInput[0].value },
      data: {
        draft: false,
        FlowForCurrentVersion: { connect: { id: proposedFlowVersion.flowId } },
      },
    });

    // do the same thing for the evolve_draft_flow_version_id if it exists
    if (proposedFlowVersion.draftEvolveFlowVersionId && proposedFlowVersion.evolveFlowId) {
      await transaction.flowVersion.update({
        where: { id: proposedFlowVersion.draftEvolveFlowVersionId },
        data: {
          draft: false,
          FlowForCurrentVersion: { connect: { id: proposedFlowVersion.evolveFlowId } },
        },
      });
    }
    return true;
  } catch (error) {
    console.log("evolveFlow error: ", error);
    return false;
  }
};
