import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { FieldSchemaType } from "@/components/Form/FlowForm/formValidation/fields";
import { StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";

interface GenerateStepConfigProps {
  permission: PermissionSchemaType;
  responseFields: FieldSchemaType[];
  requestFields: FieldSchemaType[];
  result: ResultSchemaType[];
  action: ActionSchemaType | undefined;
}

export const generateStepConfig = ({
  permission,
  responseFields,
  requestFields,
  result,
  action,
}: GenerateStepConfigProps): StepSchemaType => {
  return {
    request: {
      permission,
      fields: requestFields,
      fieldsLocked: false,
    },
    response:
      responseFields.length === 0
        ? undefined
        : {
            permission,
            fields: responseFields,
            fieldsLocked: false,
          },
    result,
    action,
    expirationSeconds: 259200,
    allowMultipleResponses: false,
  };
};
