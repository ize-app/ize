import { Prisma } from "@prisma/client";
import { parse } from "tldts";

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
      uri,
      uriPreview: parse(uri).domain ?? "",
    },
  });
  return webhook.id;
};
