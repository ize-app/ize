import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { FieldType } from "@/graphql/generated/graphql";

import { FreeInputFieldForm } from "./FreeInputFieldForm";
import { OptionFieldForm } from "./OptionsFieldForm";
import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { Select, TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";

export const FieldForm = ({ fieldsArrayMethods, fieldIndex, locked }: FieldFormProps) => {
  const { watch, setValue, register } = useFormContext<FlowSchemaType>();

  const fieldType: FieldType = watch(`${triggerFieldsPath}.${fieldIndex}.type`);

  const [displayForm, setDisplayForm] = useState<boolean>(true);
  const [prevFieldType, setPrevFieldType] = useState<FieldType | undefined>(fieldType);

  // register values that are in zod schema but not displayed to user
  useEffect(() => {
    if (prevFieldType && fieldType && fieldType !== prevFieldType) {
      const newFieldState: FieldSchemaType = createDefaultFieldState({ fieldType });
      setValue(`${triggerFieldsPath}.${fieldIndex}`, newFieldState);
      setDisplayForm(true);
    }
    setPrevFieldType(fieldType);
  }, [register, fieldType]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
      }}
    >
      <LabeledGroupedInputs>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "12px",
            width: "100%",
            backgroundColor: "#fffff5",
          }}
        >
          <Select<FlowSchemaType>
            size={"small"}
            name={`${triggerFieldsPath}.${fieldIndex}.type`}
            key={"type" + fieldIndex.toString()}
            onChange={() => setDisplayForm(false)}
            selectOptions={[
              { name: "Free input", value: FieldType.FreeInput },
              { name: "Options", value: FieldType.Options },
            ]}
            label="Type"
            disabled={locked}
          />
          <TextField<FlowSchemaType>
            name={`${triggerFieldsPath}.${fieldIndex}.name`}
            key={"name" + fieldIndex.toString()}
            multiline
            placeholderText={`What's your question?`}
            label={``}
            defaultValue=""
            disabled={locked}
          />
          {fieldType === FieldType.FreeInput && displayForm && (
            <FreeInputFieldForm
              fieldsArrayMethods={fieldsArrayMethods}
              locked={locked}
              fieldIndex={fieldIndex}
            />
          )}
          {fieldType === FieldType.Options && displayForm && (
            <OptionFieldForm
              fieldsArrayMethods={fieldsArrayMethods}
              locked={locked}
              fieldIndex={fieldIndex}
            />
          )}
        </Box>
      </LabeledGroupedInputs>
      {locked ? null : (
        <IconButton
          color="primary"
          size="small"
          aria-label="Remove input option"
          onClick={() => fieldsArrayMethods.remove(fieldIndex)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
