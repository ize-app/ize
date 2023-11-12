import { ActionArgs } from "../../../graphql/generated/graphql";
import { ActionForm } from "../newProcessWizard";

const createActionInputs = (
  action: ActionForm | undefined,
): ActionArgs | undefined =>
  action?.webhook.uri
    ? {
        optionTrigger: action.optionTrigger as string,
        webhook: {
          uri: action.webhook.uri,
        },
      }
    : undefined;

export default createActionInputs;
