export interface NotificationPayloadArgs {
  requestId: string;
  flowTitle: string;
  requestTitle: string;
  creatorName: string;
  baseIzeUrl: string;
}

export interface NotificationPayload {
  message: string;
}

export const createNotificationPayload = (
  notficationPayloadArgs: NotificationPayloadArgs,
): NotificationPayload => {
  const { requestId, requestTitle, flowTitle, creatorName, baseIzeUrl } = notficationPayloadArgs;
  return {
    message: `New Ize request: [${requestTitle}](${baseIzeUrl}/requests/${requestId})\nFrom the flow "${flowTitle}"\nTriggered by: ${creatorName}\n`,
  };
};
