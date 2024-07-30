import { Prisma } from "@prisma/client";
import { parse } from "tldts";

import { encrypt } from "@/prisma/encrypt";

export const createWebhook = async ({
  name,
  uri,
  transaction,
}: {
  name: string;
  uri: string;
  transaction: Prisma.TransactionClient;
}) => {
  const webhook = await transaction.webhook.create({
    data: {
      name,
      uri: encrypt(uri),
      uriPreview: parse(uri).domain ?? "",
    },
  });
  return webhook.id;
};
