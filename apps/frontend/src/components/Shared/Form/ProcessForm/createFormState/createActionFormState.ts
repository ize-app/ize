import { Action } from "@/graphql/generated/graphql";
import {
  ActionForm,
  HasCustomIntegration,
} from "@/components/NewProcess/newProcessWizard";

const createActionFormState = (
  action: Action | undefined,
): ActionForm | undefined => {
  if (action?.actionDetails.__typename === "WebhookAction") {
    return {
      optionTrigger: action.optionFilter?.value,
      webhook: {
        hasWebhook: HasCustomIntegration.Yes,
        uri: action.actionDetails.uri,
      },
    };
  } else return undefined;
};

export default createActionFormState;
