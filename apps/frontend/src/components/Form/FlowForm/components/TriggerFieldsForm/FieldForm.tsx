import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { stringifyValueType } from "@/components/Value/stringifyValueType";
import { ValueType } from "@/graphql/generated/graphql";

import { FreeInputFieldForm } from "./FreeInputFieldForm";
import { OptionFieldForm } from "./OptionsFieldForm";
import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { TextField } from "../../../formFields";
import { LabeledGroupedInputs } from "../../../formLayout/LabeledGroupedInputs";
import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";

export const FieldForm = ({ fieldsArrayMethods, fieldIndex, locked }: FieldFormProps) => {
  const { watch, setValue, register } = useFormContext<FlowSchemaType>();

  const type: ValueType = watch(`${triggerFieldsPath}.${fieldIndex}.type`);

  const [displayForm, setDisplayForm] = useState<boolean>(true);
  const [prevFieldType, setPrevFieldType] = useState<ValueType | undefined>(type);

  // register values that are in zod schema but not displayed to user
  useEffect(() => {
    if (prevFieldType && type && type !== prevFieldType) {
      const newFieldState: FieldSchemaType = createDefaultFieldState({ type: type });
      setValue(`${triggerFieldsPath}.${fieldIndex}`, newFieldState);
      setDisplayForm(true);
    }
    setPrevFieldType(type);
  }, [register, type]);

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
      <LabeledGroupedInputs label={stringifyValueType(type)}>
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
          <TextField<FlowSchemaType>
            name={`${triggerFieldsPath}.${fieldIndex}.name`}
            key={"name" + fieldIndex.toString()}
            multiline
            placeholderText={`What's your question?`}
            label={``}
            defaultValue=""
            disabled={locked}
          />

          {displayForm &&
            (type === ValueType.OptionSelections ? (
              <OptionFieldForm
                fieldsArrayMethods={fieldsArrayMethods}
                locked={locked}
                fieldIndex={fieldIndex}
              />
            ) : (
              <FreeInputFieldForm
                fieldsArrayMethods={fieldsArrayMethods}
                locked={locked}
                fieldIndex={fieldIndex}
              />
            ))}
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
