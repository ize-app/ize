import { Prisma, PrismaClient } from "@prisma/client";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { resultInclude, formatResult } from "./formatResult";
import { userInclude, formatUser } from "backend/src/utils/formatUser";
import { formatProcess, formatProcessVersion } from "../utils/formatProcess";
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
    evolveProcessChanges:
      process.type === "Evolve"
        ? await formatEvolveProcessChanges(inputs)
        : null,
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
): Promise<EvolveProcessesDiff[]> => {
  type ProcessIdChanges = [oldId: string, newId: string];

  const processVersionsArrayString = inputs.find(
    (input) => (input.name = "Process versions"),
  ).value;
  const processVersionArray: ProcessIdChanges[] = JSON.parse(
    processVersionsArrayString,
  );

  const processVersionIdArray = processVersionArray.flat();

  const processVersions = await prisma.processVersion.findMany({
    where: {
      id: { in: [...processVersionIdArray] },
    },
    include: processVersionInclude,
  });

  //@ts-ignore
  const formattedProcesses: Process[] = processVersions.map(
    (processVersion) => ({
      ...formatProcessVersion(processVersion),
      id: processVersion.process.id,
      createdAt: processVersion.process.createdAt.toString(),
      //@ts-ignore
      type: processVersion.process.type,
      currentProcessVersionId: processVersion.id,
    }),
  );

  // const processes: EvolveProcessesDiff = Promise.all(processVersionArray.map());
  const changes: EvolveProcessesDiff[] = processVersionArray.map(
    (versionChangeArray) => {
      const [oldId, newId] = versionChangeArray;
      const currentProcess = formattedProcesses.find(
        (process) => process.currentProcessVersionId === oldId,
      );
      const proposedProcess = formattedProcesses.find(
        (process) => process.currentProcessVersionId === newId,
      );
      return {
        processId: currentProcess.id,
        processName: currentProcess.name,
        changes: {
          current: currentProcess,
          proposed: proposedProcess,
        },
      };
    },
  );

  return changes;
};

// type EvolveProcessesDiff {
//   processName: String!
//   processId: String!
//   changes: ProposedProcessEvolution!
// }

// type ProposedProcessEvolution {
//   old: Process!
//   proposed: Process!
// }
