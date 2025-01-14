import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, InputAdornment, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Path, useFieldArray, useFormContext } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";
import { SelectOption } from "@/components/Form/formFields/Select";
import { LabeledGroupedInputs } from "@/components/Form/formLayout/LabeledGroupedInputs";
import { stringifyFormInputValue } from "@/components/Form/InputField/stringifyFormInputValue";
import { getSelectOptionName } from "@/components/Form/utils/getSelectOptionName";

import { FlowSchemaType } from "../../formValidation/flow";

interface DecisionOptionConditionFormProps {
  stepIndex: number; // react-hook-form name
  resultIndex: number;
  display?: boolean;
}

export const DecisionOptionConditionForm = ({
  stepIndex,
  resultIndex,
  display = true,
}: DecisionOptionConditionFormProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addOption = ({ optionId }: { optionId: string }) => {
    // optionsArrayMethods.append(createDefaultOptionState({ type }) as FieldArray<T, ArrayPath<T>>);
    optionsArrayMethods.append({
      optionId,
      threshold: 1,
    });
    handleClose();
  };

  const decisionOptionConditionsPath = `steps.${stepIndex}.result.${resultIndex}.decision.conditions`;
  const { control, getValues } = useFormContext<FlowSchemaType>();
  const optionsArrayMethods = useFieldArray({
    control: control,
    name: `steps.${stepIndex}.result.${resultIndex}.decision.conditions`,
  });

  const conditions =
    getValues(`steps.${stepIndex}.result.${resultIndex}.decision.conditions`) ?? [];

  const options: SelectOption[] = (
    getValues(`steps.${stepIndex}.fieldSet.fields.${resultIndex}.optionsConfig.options`) ?? []
  ).map((option) => {
    return {
      name: stringifyFormInputValue({ input: option.input }),
      value: option.optionId,
    };
  });

  const displayedOptions = options.filter((option) => {
    return !conditions.some((conditions) => conditions.optionId === option.value);
  });

  return (
    <LabeledGroupedInputs
      // label="Set specific criteria for specific options"
      sx={{
        padding: "12px",
        flexDirection: "column",
        display: display ? "flex" : "none",
      }}
    >
      <Typography variant="description">
        Add conditions for how specific options can become the decision
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {optionsArrayMethods.fields.map((item, conditionIndex) => {
          const optionField =
            `${decisionOptionConditionsPath}.${conditionIndex}` as Path<FlowSchemaType>;

          const optionId: string = getValues(
            `${optionField}.optionId` as Path<FlowSchemaType>,
          ) as string;

          const optionName = getSelectOptionName(options, optionId);

          //   const valueField = `${decisionOptionConditionsPath}.${conditionIndex}.input.value` as Path<T>;
          // const option = getValues(`steps.${stepIndex}.fieldset.fields.${resultIndex}.optionsConfig`);
          return (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography
                sx={{
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {optionName}
              </Typography>
              <TextField<FlowSchemaType>
                label="Threshold votes"
                name={`${optionField}.threshold` as Path<FlowSchemaType>}
                size="small"
                // variant="standard"
                sx={{ width: "180px" }}
                showLabel={false}
                defaultValue=""
                endAdornment={<InputAdornment position="end">votes</InputAdornment>}
              />
              <IconButton
                color="primary"
                aria-label="Remove option"
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={() => optionsArrayMethods.remove(conditionIndex)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
      </Box>
      <>
        <Button
          sx={{ position: "relative", alignSelf: "flex-start" }}
          variant="outlined"
          size="small"
          onClick={handleClick}
        >
          Add decision condition
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          autoFocus={false}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {displayedOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => addOption({ optionId: option.value as string })}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    </LabeledGroupedInputs>
  );
};
