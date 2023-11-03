import { Prisma, PrismaClient } from "@prisma/client";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { userInclude, formatUser } from "backend/src/utils/formatUser";

import { formatProcessVersion } from "../utils/formatProcess";

import { processVersionInclude } from "../utils/formatProcess";
import {
  Request,
  Process,
  InputTemplate,
  RequestInput,
  RequestInputArgs,
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
});

type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

export const formatRequest = (requestData: RequestPrismaType): Request => {
  const process: Process = {
    ...formatProcessVersion(requestData.processVersion),
    id: requestData.processVersion.process.id,
    createdAt: requestData.processVersion.process.createdAt.toString(),
    currentProcessVersionId:
      requestData.processVersion.process.currentProcessVersionId,
  };

  const [name, inputs] = formatInputs(
    process.inputs,
    requestData.requestInputs,
  );

  const req: Request = {
    id: requestData.id,
    name: name,
    creator: formatUser(requestData.creator),
    expirationDate: requestData.expirationDate.toString(),
    inputs: inputs,
    process: process,
    createdAt: requestData.createdAt.toString(),
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
