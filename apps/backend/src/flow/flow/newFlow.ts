import { MutationNewFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { newStep } from "./helpers/newStep";

export const newFlow = async ({ args }: { args: MutationNewFlowArgs }): Promise<string> => {
  // TODO gradually building this out
  prisma.$transaction(async (transaction) => {
    await Promise.all(
      args.flow.steps.map(async (step, index) => {
        await newStep({ args: step, transaction });
      }),
    );
  });
  return "";
};
