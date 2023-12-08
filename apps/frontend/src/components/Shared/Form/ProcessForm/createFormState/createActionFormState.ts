import { ActionForm, HasCustomIntegration } from "@/components/shared/Form/ProcessForm/types";
import { Action } from "@/graphql/generated/graphql";

const createActionFormState = (action: Action | undefined): ActionForm | undefined => {
  switch (action?.actionDetails?.__typename) {
    case "WebhookAction":
      return {
        optionTrigger: action.optionFilter?.value,
        webhook: {
          hasWebhook: HasCustomIntegration.Yes,
          uri: action.actionDetails.uri,
        },
      };
    default:
      return {
        optionTrigger: undefined,
        webhook: {
          hasWebhook: HasCustomIntegration.No,
          uri: undefined,
        },
      };
  }
};

export default createActionFormState;
