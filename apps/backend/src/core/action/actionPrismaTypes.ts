import { Prisma } from "@prisma/client";

export const webhookInclude = Prisma.validator<Prisma.ActionConfigWebhookInclude>()({});

export type WebhookPrismaType = Prisma.ActionConfigWebhookGetPayload<{
  include: typeof webhookInclude;
}>;

export const actionConfigInclude = Prisma.validator<Prisma.ActionConfigInclude>()({
  ActionConfigWebhook: {
    include: webhookInclude,
  },
  ActionConfigFilter: true,
  ActionConfigTriggerStep: true,
});

export type ActionConfigPrismaType = Prisma.ActionConfigGetPayload<{
  include: typeof actionConfigInclude;
}>;

export const actionInclude = Prisma.validator<Prisma.ActionInclude>()({});

export type ActionPrismaType = Prisma.ActionGetPayload<{
  include: typeof actionInclude;
}>;
