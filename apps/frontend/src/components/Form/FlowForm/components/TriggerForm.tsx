import { Box } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FieldsForm } from "./FieldsForm";
import { PermissionForm } from "./PermissionForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { FlowSchemaType } from "../formValidation/flow";

interface TriggerFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const TriggerForm = ({ formMethods, formIndex, show }: TriggerFormProps) => {
  const error = formMethods.formState.errors.steps?.[formIndex]?.request;

  const fieldsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.request.fields`,
  });

  return (
    formIndex === 0 && (
      <Box sx={{ display: show ? "block" : "none" }}>
        <PanelAccordion title="Permission" hasError={!!error?.permission}>
          <PermissionForm formMethods={formMethods} formIndex={formIndex} branch={"request"} />
        </PanelAccordion>
        <PanelAccordion title="Request fields" hasError={!!error?.fields}>
          <FieldsForm
            formIndex={formIndex}
            branch={"request"}
            formMethods={formMethods}
            //@ts-expect-error TODO
            fieldsArrayMethods={fieldsArrayMethods}
          />
        </PanelAccordion>
      </Box>
    )
  );
};
