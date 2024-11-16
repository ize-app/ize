import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import AsyncSelect from "@/components/Form/formFields/AsyncSelect";
import { FieldType } from "@/graphql/generated/graphql";

import { DecisionConfigFormProps } from "./DecisionConfigForm";
import { Switch } from "../../../formFields";
import { SelectOption } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";

const createDefaultDecisionOptions = (field: FieldSchemaType): SelectOption[] => {
  const defaultDecisionOptions: SelectOption[] = [];

  if (field.type === FieldType.Options) {
    (field.optionsConfig.options ?? []).forEach((o) => {
      defaultDecisionOptions.push({
        name: o.name as string,
        value: o.optionId,
      });
    });
  }

  return defaultDecisionOptions;
};

export const DefaultDecisionForm = ({
  stepIndex,
  resultIndex,
  field,
  display,
}: DecisionConfigFormProps) => {
  const [defaultDecisionOptions, setDefaultDecisionOptions] = useState<SelectOption[]>(
    createDefaultDecisionOptions(field),
  );
  const { watch, setValue, getValues } = useFormContext<FlowSchemaType>();
  const defaultDecision = watch(
    `steps.${stepIndex}.result.${resultIndex}.decision.defaultDecision`,
  );
  const hasDefaultDecision = defaultDecision?.hasDefault ?? false;

  const [prevHasDefaultDecision, setPrevHasDefaultDecision] = useState<boolean>(hasDefaultDecision);

  // handle default states when hasDefaultDecision changes
  // but don't reset state on first render of flow form's default state

  const resetDefaultDecisionOptions = () => {
    const refreshedField = getValues(`steps.${stepIndex}.fieldSet.fields.${resultIndex}`);
    setDefaultDecisionOptions(createDefaultDecisionOptions(refreshedField));
  };

  const resetDefaultDecision = () => {
    resetDefaultDecisionOptions();
    const optionId: string | null = (defaultDecisionOptions[0]?.value as string) ?? null;
    setValue(
      `steps.${stepIndex}.result.${resultIndex}.decision.defaultDecision.optionId`,
      optionId,
    );
  };

  // change default option value when hasDefaultOption is toggled
  useEffect(() => {
    if (!prevHasDefaultDecision && hasDefaultDecision) {
      resetDefaultDecision();
    } else if (prevHasDefaultDecision && !hasDefaultDecision) {
      setValue(`steps.${stepIndex}.result.${resultIndex}.decision.defaultDecision.optionId`, null);
    }
    setPrevHasDefaultDecision(hasDefaultDecision);
  }, [hasDefaultDecision]);

  // handle option selection t
  useEffect(() => {
    if (
      hasDefaultDecision &&
      defaultDecision?.optionId &&
      !defaultDecisionOptions.some((option) => option.value === defaultDecision?.optionId)
    )
      resetDefaultDecision();
  }, [defaultDecisionOptions]);

  return (
    <ResponsiveFormRow
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        display: display ? "flex" : "none",
      }}
    >
      <Switch<FlowSchemaType>
        name={`steps.${stepIndex}.result.${resultIndex}.decision.defaultDecision.hasDefault`}
        label="Default result if no decision"
      />
      {!!defaultDecision?.hasDefault && (
        <AsyncSelect<FlowSchemaType, string>
          label="Default option"
          variant="standard"
          name={`steps.${stepIndex}.result.${resultIndex}.decision.defaultDecision.optionId`}
          getOptionLabel={(option) => {
            return defaultDecisionOptions.find((o) => o.value === option)?.name ?? "";
          }}
          sx={{ maxWidth: "300px", width: "200px" }}
          isOptionEqualToValue={(option, value) => option === value}
          loading={false}
          options={defaultDecisionOptions.map((option) => option.value as string)}
          fetchOptions={() => {
            resetDefaultDecisionOptions();
          }}
        />
      )}
    </ResponsiveFormRow>
  );
};
