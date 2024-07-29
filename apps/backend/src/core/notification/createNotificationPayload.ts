import { User } from "@/graphql/generated/resolver-types";

export interface NotificationPayloadArgs {
  requestId: string;
  flowTitle: string;
  requestTitle: string;
  creator: User;
  baseIzeUrl: string;
}

export interface NotificationPayload {
  message: string;
}

export const createNotificationPayload = (
  notficationPayloadArgs: NotificationPayloadArgs,
): NotificationPayload => {
  const { requestId, requestTitle, flowTitle, creator, baseIzeUrl } = notficationPayloadArgs;
  return {
    message: `New Ize request: [${requestTitle}](${baseIzeUrl}/requests/${requestId})\nFrom the flow "${flowTitle}"\nTriggered by: ${creator.name}\n`,
  };
};
