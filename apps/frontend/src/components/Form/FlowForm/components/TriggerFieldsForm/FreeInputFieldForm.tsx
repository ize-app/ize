import { useFormContext } from "react-hook-form";

import {
  FieldFormProps,
  createFreeInputDataTypeOptions,
  triggerFieldsPath,
} from "./TriggerFieldsForm";
import { Select } from "../../../formFields";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../../formValidation/flow";

export const FreeInputFieldForm = ({ fieldIndex, locked }: FieldFormProps) => {
  const { getValues } = useFormContext<FlowSchemaType>();

  const type = getValues(`${triggerFieldsPath}.${fieldIndex}.type`);

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          size={"small"}
          disabled={locked}
          name={`${triggerFieldsPath}.${fieldIndex}.type`}
          key={"dataType" + fieldIndex.toString()}
          selectOptions={createFreeInputDataTypeOptions(type)}
          label="Free input data type"
          defaultValue=""
        />
      </ResponsiveFormRow>
    </>
  );
};
