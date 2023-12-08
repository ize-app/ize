import { ActionArgs } from "../../../../../graphql/generated/graphql";

import {
  ActionForm,
  defaultWebhookTriggerOption,
} from "@/components/shared/Form/ProcessForm/types";

const createActionInputs = (action: ActionForm | undefined): ActionArgs | undefined =>
  action?.webhook?.uri
    ? {
        optionTrigger:
          action.optionTrigger === defaultWebhookTriggerOption.value
            ? null
            : (action.optionTrigger as string),
        webhook: {
          uri: action.webhook.uri,
        },
      }
    : undefined;

export default createActionInputs;
