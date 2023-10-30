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
    input: NewCustomProcessInputs;
  },
  context: GraphqlRequestContext,
) => {
  return await newCustomProcess(args.input, context);
};

export const processQueries = {};

export const processMutations = { newProcess };
