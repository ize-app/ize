import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";

import {
  EvolveArgs,
  NewEditProcessRequestArgs,
  NewProcessArgs,
} from "frontend/src/graphql/generated/graphql";
import { newRequestService } from "./newRequestService";

export const newEditRequestService = async (
  {
    args,
    transaction = prisma,
  }: {
    args: NewEditProcessRequestArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  // do the diff
  // if field is different, create from scrach using same logic as new process
  // create final record - need to add a "published" field to edit_process_requests and filter out current requests by that
  // need to finsd
  // create inputs for the request
  // process version of proposed but also need to have process version of edit - might need a special resolver
  // finally create the request using traditional means
  //   newRequestService();
};
