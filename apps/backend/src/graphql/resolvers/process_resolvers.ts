import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { Prisma, PrismaClient } from "@prisma/client";

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
) => {
  return await newCustomProcess(args.process, context);
};

export const processQueries = {};

export const processMutations = { newProcess };
