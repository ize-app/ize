import { Prisma } from "@prisma/client";

export const webhookInclude = Prisma.validator<Prisma.WebhookInclude>()({});

export type WebhookPrismaType = Prisma.WebhookGetPayload<{
  include: typeof webhookInclude;
}>;

export const actionInclude = Prisma.validator<Prisma.ActionNewInclude>()({
  Webhook: {
    include: webhookInclude,
  },
});

export type ActionNewPrismaType = Prisma.ActionNewGetPayload<{
  include: typeof actionInclude;
}>;

export const actionExecutionInclude = Prisma.validator<Prisma.ActionExecutionInclude>()({});

export type ActionExecutionPrismaType = Prisma.ActionExecutionGetPayload<{
  include: typeof actionExecutionInclude;
}>;
