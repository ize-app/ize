import { ActionForm } from "../../../../NewProcess/newProcessWizard";
import { ActionArgs } from "../../../../../graphql/generated/graphql";

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
