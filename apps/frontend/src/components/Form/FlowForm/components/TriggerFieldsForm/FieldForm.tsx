import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useFormContext } from "react-hook-form";

import { stringifyValueType } from "@/components/Value/stringifyValueType";
import { ValueType } from "@/graphql/generated/graphql";

import { OptionFieldForm } from "./OptionsFieldForm";
import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { TextField } from "../../../formFields";
import { FlowSchemaType } from "../../formValidation/flow";

export const FieldForm = ({ fieldsArrayMethods, fieldIndex, locked }: FieldFormProps) => {
  const { watch } = useFormContext<FlowSchemaType>();

  const type: ValueType = watch(`${triggerFieldsPath}.${fieldIndex}.type`);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
        }}
      >
        <TextField<FlowSchemaType>
          name={`${triggerFieldsPath}.${fieldIndex}.name`}
          key={"name" + fieldIndex.toString()}
          multiline
          placeholderText={`What's your question?`}
          label={stringifyValueType(type)}
          showLabel={true}
          // seperateLabel={true}
          defaultValue=""
          disabled={locked}
        />

        {type === ValueType.OptionSelections && (
          <OptionFieldForm
            fieldsArrayMethods={fieldsArrayMethods}
            locked={locked}
            fieldIndex={fieldIndex}
          />
        )}
      </Box>
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
