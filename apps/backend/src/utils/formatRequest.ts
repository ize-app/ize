import { Prisma } from "@prisma/client";
import { resultInclude, formatResult } from "./formatResult";
import { userInclude, formatUser, MePrismaType } from "@utils/formatUser";
import { ProcessVersionPrismaType, formatProcessVersion } from "../utils/formatProcess";
import { responseInclude, formatResponses } from "./formatResponse";
import { prisma } from "../prisma/client";

import { processVersionInclude } from "../utils/formatProcess";

import {
  Request,
  Process,
  InputTemplate,
  RequestInput,
  EvolveProcessesDiff,
  ProcessType,
} from "@graphql/generated/resolver-types";
import { getGroupIdsOfUser } from "@/services/groups/getGroupIdsOfUser";

export const requestInputInclude = Prisma.validator<Prisma.RequestInputInclude>()({
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

export type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

export const formatRequest = async (
  requestData: RequestPrismaType,
  user: MePrismaType | undefined | null,
): Promise<Request> => {
  const groupIds = await getGroupIdsOfUser({ user });
  const process: Process = {
    ...formatProcessVersion(requestData.processVersion, user, groupIds),
    id: requestData.processVersion.process.id,
    createdAt: requestData.processVersion.process.createdAt.toString(),
    type: requestData.processVersion.process.type as ProcessType,
    currentProcessVersionId: requestData.processVersion.id,
  };

  const [name, inputs] = formatInputs(process.inputs, requestData.requestInputs);

  const evolveChanges =
    process.type === ProcessType.Evolve
      ? await formatEvolveProcessChanges(inputs, requestData.id, user, groupIds)
      : null;

  const req: Request = await {
    id: requestData.id,
    name: name,
    creator: formatUser(requestData.creator),
    expirationDate: requestData.expirationDate.toString(),
    inputs: inputs,
    process: process,
    createdAt: requestData.createdAt.toString(),
    responses: formatResponses(requestData.responses, process.options, user?.id),
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
    const requestInput = requestInputs.find((input) => input.inputId === elem.id);
    if (!requestInput)
      throw Error("ERROR formatInputs: Request inputs do not match process's input templates.");
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

  if (!titleInput) throw Error("ERROR formatInputs: No title input");

  return [titleInput?.value as string, inputsWithValue];
};

const formatEvolveProcessChanges = async (
  inputs: RequestInput[],
  requestId: string,
  user: MePrismaType | undefined | null,
  groupIds: string[],
): Promise<EvolveProcessesDiff[]> => {
  type ProcessIdChanges = [oldId: string, newId: string];

  // string arrays of changes between process Versions
  const processVersionsArrayString = inputs.find((input) => (input.name = "Process versions"))
    ?.value;

  if (!processVersionsArrayString)
    throw Error(
      "ERROR formatEvolveProcessChanges: Cannot find processVersionsArray in edit request",
    );

  const processVersionArray: ProcessIdChanges[] = JSON.parse(processVersionsArrayString);

  const processVersionIdArray = processVersionArray.flat();

  // get both the current / proposed process versions from db
  const processVersions = await prisma.processVersion.findMany({
    where: {
      id: { in: [...processVersionIdArray] },
    },
    include: processVersionInclude,
  });

  const changes: EvolveProcessesDiff[] = processVersionArray.map((versionChangeArray) => {
    const [oldId, newId] = versionChangeArray;

    // finding the current process
    const currentProcessVersion = processVersions.find((vers) => {
      return vers.id === oldId;
    });
    const proposedProcessVersion = processVersions.find((vers) => {
      return vers.id === newId;
    });

    if (!currentProcessVersion || !proposedProcessVersion)
      throw Error("ERROR formatEvolveProcessChanges: Cannot find process versions");

    const currentProcess = processVersionToProcess(currentProcessVersion, user, groupIds);
    const proposedProcess = processVersionToProcess(proposedProcessVersion, user, groupIds);
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
  });

  return changes;
};

const processVersionToProcess = (
  processVersion: ProcessVersionPrismaType,
  user: MePrismaType | undefined | null,
  groupIds: string[],
): Process => {
  return {
    ...formatProcessVersion(processVersion, user, groupIds),
    id: processVersion.process.id,
    createdAt: processVersion.process.createdAt.toString(),
    type: processVersion.process.type as ProcessType,
    currentProcessVersionId: processVersion.id,
  };
};
