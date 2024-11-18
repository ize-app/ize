import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { FieldSchemaType } from "@/components/Form/FlowForm/formValidation/fields";
import { StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { ResultType } from "@/graphql/generated/graphql";

interface GenerateStepConfigProps {
  permission: PermissionSchemaType;
  responseFields: FieldSchemaType[];
  result: ResultSchemaType[];
  action: ActionSchemaType | undefined;
}

export const generateStepConfig = ({
  permission,
  responseFields,
  result,
  action,
}: GenerateStepConfigProps): StepSchemaType => {
  const allowMultipleResponses = result[0]?.type === ResultType.LlmSummary
  return {
    fieldSet: {
      fields: responseFields,
      locked: false,
    },
    response:
      responseFields.length === 0
        ? undefined
        : {
            permission,
            canBeManuallyEnded: true,
            expirationSeconds: 259200,
            allowMultipleResponses,
            minResponses: 1,
          },
    result,
    action,
  };
};
