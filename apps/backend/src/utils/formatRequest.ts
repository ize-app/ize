import { Prisma, PrismaClient } from "@prisma/client";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { resultInclude, formatResult } from "./formatResult";
import { userInclude, formatUser } from "backend/src/utils/formatUser";
import {
  ProcessVersionPrismaType,
  formatProcess,
  formatProcessVersion,
} from "../utils/formatProcess";
import { responseInclude, formatResponses } from "./formatResponse";
import { prisma } from "../prisma/client";

import { processVersionInclude } from "../utils/formatProcess";
import {
  Request,
  Process,
  InputTemplate,
  RequestInput,
  EvolveProcessesDiff,
} from "frontend/src/graphql/generated/graphql";

export const requestInputInclude =
  Prisma.validator<Prisma.RequestInputInclude>()({
    input: true,
  });

type RequestInputPrismaType = Prisma.RequestInputGetPayload<{
  include: typeof requestInputInclude;
}>;

export const requestInclude = Prisma.validator<Prisma.RequestInclude>()({
  processVersion: {
    include: processVersionInclude,
  },
  creator: {
    include: userInclude,
  },
  requestInputs: {
    include: requestInputInclude,
  },
  responses: {
    include: responseInclude,
  },
  result: {
    include: resultInclude,
  },
});

type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

export const formatRequest = async (
  requestData: RequestPrismaType,
  userId?: string,
): Promise<Request> => {
  const process: Process = {
    ...formatProcessVersion(requestData.processVersion),
    id: requestData.processVersion.process.id,
    createdAt: requestData.processVersion.process.createdAt.toString(),
    //@ts-ignore
    type: requestData.processVersion.process.type,
    currentProcessVersionId:
      requestData.processVersion.process.currentProcessVersionId,
  };

  const [name, inputs] = formatInputs(
    process.inputs,
    requestData.requestInputs,
  );

  const evolveChanges =
    process.type === "Evolve"
      ? await formatEvolveProcessChanges(inputs, requestData.id)
      : null;

  const req: Request = await {
    id: requestData.id,
    name: name,
    creator: formatUser(requestData.creator),
    expirationDate: requestData.expirationDate.toString(),
    inputs: inputs,
    process: process,
    createdAt: requestData.createdAt.toString(),
    responses: formatResponses(requestData.responses, process.options, userId),
    result: formatResult(requestData.result, process.options),
    evolveProcessChanges: evolveChanges,
  };

  return req;
};

const formatInputs = (
  inputTemplates: InputTemplate[],
  requestInputs: RequestInputPrismaType[],
): [string, RequestInput[]] => {
  const inputsWithValue = inputTemplates.map((elem) => {
    const requestInput = requestInputs.find(
      (input) => input.inputId === elem.id,
    );
    return {
      inputTemplateId: elem.id,
      requestInputId: requestInput.id,
      description: elem.description,
      name: elem.name,
      type: elem.type,
      required: elem.required,
      value: requestInput.value,
    };
  });

  const titleInput = inputsWithValue.shift();

  return [titleInput.value, inputsWithValue];
};

const formatEvolveProcessChanges = async (
  inputs: RequestInput[],
  requestId: string,
): Promise<EvolveProcessesDiff[]> => {
  type ProcessIdChanges = [oldId: string, newId: string];

  // string arrays of changes between process Versions
  const processVersionsArrayString = inputs.find(
    (input) => (input.name = "Process versions"),
  ).value;
  const processVersionArray: ProcessIdChanges[] = JSON.parse(
    processVersionsArrayString,
  );

  const processVersionIdArray = processVersionArray.flat();

  // get both the current / proposed process versions from db
  const processVersions = await prisma.processVersion.findMany({
    where: {
      id: { in: [...processVersionIdArray] },
    },
    include: processVersionInclude,
  });

  const changes: EvolveProcessesDiff[] = processVersionArray.map(
    (versionChangeArray) => {
      const [oldId, newId] = versionChangeArray;

      // finding the current process
      const currentProcessVersion = processVersions.find((vers) => {
        return vers.id === oldId;
      });
      const proposedProcessVersion = processVersions.find((vers) => {
        return vers.id === newId;
      });

      const currentProcess = processVersionToProcess(currentProcessVersion);
      const proposedProcess = processVersionToProcess(proposedProcessVersion);
      // adding suffic at end because apollo's caching
      proposedProcess.id = proposedProcess.id + "_proposed_" + requestId;

      return {
        processId: currentProcess.id,
        processName: currentProcess.name,
        changes: {
          current: { ...currentProcess },
          proposed: { ...proposedProcess },
        },
      };
    },
  );

  return changes;
};

const processVersionToProcess = (
  processVersion: ProcessVersionPrismaType,
): Process => {
  return {
    ...formatProcessVersion(processVersion),
    id: processVersion.process.id,
    createdAt: processVersion.process.createdAt.toString(),
    //@ts-ignore
    type: processVersion.process.type,
    currentProcessVersionId: processVersion.id,
  };
};
