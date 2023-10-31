import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "backend/src/utils/formatProcess";
import { Process } from "frontend/src/graphql/generated/graphql";

import {
  newCustomProcess,
  NewCustomProcessInputs,
} from "../../services/processes/newProcess";

const newProcess = async (
  root: unknown,
  args: {
    process: NewCustomProcessInputs;
  },
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newCustomProcess(args.process, context);
};

const process = async (
  root: unknown,
  args: {
    processId: string;
  },
  context: GraphqlRequestContext,
): Promise<Process> => {
  const processData = await prisma.process.findFirstOrThrow({
    include: processInclude,
    where: {
      id: args.processId,
    },
  });

  return formatProcess(processData);
};

export const processQueries = { process };

export const processMutations = { newProcess };
