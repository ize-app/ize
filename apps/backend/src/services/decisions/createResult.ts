import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";

const createResult = async ({
  requestId,
  optionId,
  transaction = prisma,
}: {
  requestId: string;
  optionId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  const result = await transaction.result.create({
    data: {
      requestId,
      optionId,
    },
  });
  return result.id;
};

export default createResult;
