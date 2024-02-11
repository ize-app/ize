import { NewStepArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newFieldSet } from "@/flow/fields/newFieldSet";

export const newStep = async ({
  args,
  transaction,
}: {
  args: NewStepArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const requestFieldSetId = await newFieldSet({ fields: args.request.fields, transaction });
  const responseFieldSetId = await newFieldSet({ fields: args.response.fields, transaction });

  console.log("request fieldSetId", requestFieldSetId);
  console.log("response fieldSetId", responseFieldSetId);
  return "";
};
