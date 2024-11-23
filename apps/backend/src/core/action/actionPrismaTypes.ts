import { Prisma } from "@prisma/client";

export const webhookInclude = Prisma.validator<Prisma.ActionConfigWebhookInclude>()({});

export type WebhookPrismaType = Prisma.ActionConfigWebhookGetPayload<{
  include: typeof webhookInclude;
}>;

export const actionInclude = Prisma.validator<Prisma.ActionConfigInclude>()({
  ActionConfigWebhook: {
    include: webhookInclude,
  },
  ActionConfigFilter: true,
});

export type ActionConfigPrismaType = Prisma.ActionConfigGetPayload<{
  include: typeof actionInclude;
}>;

export const actionExecutionInclude = Prisma.validator<Prisma.ActionExecutionInclude>()({});

export type ActionExecutionPrismaType = Prisma.ActionExecutionGetPayload<{
  include: typeof actionExecutionInclude;
}>;
