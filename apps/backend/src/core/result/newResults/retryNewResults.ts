import { prisma } from "../../../prisma/client";
import { stepInclude } from "../../flow/flowPrismaTypes";
import { responseInclude } from "../../response/type";
import { resultInclude } from "../types";
import { runResultsAndActions } from "./runResultsAndActions";
export const retryNewResults = async ({}: {}) => {
  //  check if there are any request steps that don't have completed results
  const stepsWithoutResults = await prisma.requestStep.findMany({
    where: {
      expired: true,
      resultsComplete: false,
    },
    include: {
      Step: {
        include: stepInclude,
      },
      Responses: {
        include: responseInclude,
      },
      Results: {
        include: resultInclude,
      },
    },
  });

  // retry getting results for each result
  await Promise.all(
    stepsWithoutResults.map(async (reqStep) => {
      await runResultsAndActions({
        step: reqStep.Step,
        responses: reqStep.Responses,
        existingResults: reqStep.Results,
        requestStepId: reqStep.id,
      });
    }),
  );
};
