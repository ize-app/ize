import { Box } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FieldsForm } from "./FieldsForm";
import { PermissionForm } from "./PermissionForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Switch } from "../../formFields";
import { FlowSchemaType } from "../formValidation/flow";

interface TriggerFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const TriggerForm = ({ formMethods, formIndex, show }: TriggerFormProps) => {
  const error = formMethods.formState.errors.steps?.[formIndex]?.request;

  const isReusable = formMethods.watch(`reusable`);

  const fieldsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.request.fields`,
  });

  return (
    formIndex === 0 && (
      <Box sx={{ display: show ? "block" : "none" }}>
        <Box sx={{ padding: "16px" }}>
          <Switch<FlowSchemaType>
            name={`reusable`}
            control={formMethods.control}
            label="Flow can be reused"
          />
        </Box>
        {isReusable && (
          <>
            <PanelAccordion title="Permission" hasError={!!error?.permission}>
              <PermissionForm<FlowSchemaType>
                fieldName={`steps.${formIndex}.request.permission`}
                branch={"request"}
              />
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
          </>
        )}
      </Box>
    )
  );
};
