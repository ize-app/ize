import { Prisma } from "@prisma/client";

import { PermissionArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newEntitySet } from "../entity/newEntitySet";

interface PermissionArgsBase {
  permission: PermissionArgs;
  transaction: Prisma.TransactionClient;
}

interface TriggerPermission extends PermissionArgsBase {
  type: "trigger";
  flowVersionId: string;
}

interface ResponsePermission extends PermissionArgsBase {
  type: "response";
  responseConfigId: string;
}

type NewPermissionArgs = TriggerPermission | ResponsePermission;

export const newPermission = async ({
  transaction,
  permission: args,
  ...props
}: NewPermissionArgs): Promise<string> => {
  // const { transaction, permission } = args;
  // let entitySetArgs: PrismaEntitySetArgs;
  let entitySetId: string | undefined = undefined;
  let flowVersionId: string | undefined = undefined;
  let responseConfigId: string | undefined = undefined;

  if (props.type === "trigger") flowVersionId = props.flowVersionId;
  else if (props.type === "response") responseConfigId = props.responseConfigId;

  if (!flowVersionId && !responseConfigId)
    throw new GraphQLError(`Permission requires flowVersionId or responseConfigId`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (!args.anyone && args.entities.length === 0)
    throw new GraphQLError(`newPermission: missing entity ids`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (args.entities.length > 0) {
    entitySetId = await newEntitySet({ entityArgs: args.entities, transaction });
  }

  const newPermission = await transaction.permission.create({
    data: {
      // in case args.anyone is true  even though there are entity permissions set
      anyone: args.anyone && !entitySetId,
      responseConfigId,
      flowVersionId,
      entitySetId,
    },
  });

  return newPermission.id;
};
