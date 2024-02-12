import { NewStepArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { newFieldSet } from "@/flow/fields/newFieldSet";
import { newPermission } from "@/flow/permission/newPermission";

export const newStep = async ({
  args,
  transaction,
}: {
  args: NewStepArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const requestFieldSetId = await newFieldSet({ fields: args.request.fields, transaction });
  const responseFieldSetId = await newFieldSet({ fields: args.response.fields, transaction });
  const requestPermissionsId = await newPermission({
    permission: args.request.permission,
    transaction,
  });
  const responsePermissionsId = await newPermission({
    permission: args.response.permission,
    transaction,
  });

  console.log("request fieldSetId", requestFieldSetId);
  console.log("response fieldSetId", responseFieldSetId);
  console.log("request PermissionsId", requestPermissionsId);
  console.log("response PermissionsId", responsePermissionsId);

  return "";
};
