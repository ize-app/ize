import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/client";

export const triggerNextStep = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  // get the id of the next step and request

  // trigger the next step if it exists
  // const requestStep = await transaction.requestStep.create({
  //   data: {
  //     expirationDate: new Date(new Date().getTime() + (step.expirationSeconds as number) * 1000),
  //     Request: {
  //       connect: {
  //         id: request.id,
  //       },
  //     },
  //     Step: {
  //       connect: {
  //         id: step.id,
  //       },
  //     },
  //     CurrentStepParent: {
  //       connect: {
  //         id: request.id,
  //       },
  //     },
  //   },
  // });

  // update current request step

  // create linked options

  return true;
};
