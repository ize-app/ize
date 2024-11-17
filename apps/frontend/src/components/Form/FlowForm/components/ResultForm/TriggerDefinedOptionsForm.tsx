import { useEffect, useState } from "react";
import { FieldPath, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import { FieldDataType } from "@/graphql/generated/graphql";

import { Switch } from "../../../formFields";
import { Select } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { TriggerDefinedOptionsSchemaType } from "../../formValidation/fields";

export interface RequestDefinedOptionsProps<T extends FieldValues> {
  fieldName: FieldPath<T>;
}

export const TriggerDefinedOptionsForm = <T extends FieldValues>({
  fieldName,
}: RequestDefinedOptionsProps<T>) => {
  const { watch, setValue } = useFormContext<T>();

  const triggerDefinedOptionsPath = `${fieldName}` as Path<T>;

  const triggerDefinedOptions = watch(triggerDefinedOptionsPath) as TriggerDefinedOptionsSchemaType;

  const hasTriggerDefinedOptions = triggerDefinedOptions?.hasTriggerDefinedOptions ?? false;
  const triggerDefinedOptionsDataType = triggerDefinedOptions?.dataType;

  const [prevHasTriggerDefinedOptions, setPrevHasTriggerDefinedOptions] =
    useState<boolean>(hasTriggerDefinedOptions);

  // change default option value when hasDefaultOption is toggled
  useEffect(() => {
    if (!prevHasTriggerDefinedOptions && hasTriggerDefinedOptions) {
      setValue(triggerDefinedOptionsPath, {
        hasTriggerDefinedOptions: true,
        dataType: FieldDataType.String,
      } as TriggerDefinedOptionsSchemaType as PathValue<T, typeof triggerDefinedOptionsPath>);
    } else if (prevHasTriggerDefinedOptions && !hasTriggerDefinedOptions) {
      setValue(triggerDefinedOptionsPath, {
        hasTriggerDefinedOptions: false,
        dataType: null,
      } as TriggerDefinedOptionsSchemaType as PathValue<T, typeof triggerDefinedOptionsPath>);
    }
    setPrevHasTriggerDefinedOptions(hasTriggerDefinedOptions);
  }, [hasTriggerDefinedOptions]);

  return (
    <ResponsiveFormRow
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Switch<T>
        name={`${fieldName}.hasTriggerDefinedOptions` as Path<T>}
        label="Let triggerer add options"
      />
      {triggerDefinedOptionsDataType && (
        <Select<T>
          name={`${fieldName}.dataType` as Path<T>}
          defaultValue=""
          selectOptions={[
            { name: "Text", value: FieldDataType.String },
            { name: "Number", value: FieldDataType.Number },
            { name: "Uri", value: FieldDataType.Uri },
            { name: "Date", value: FieldDataType.Date },
            { name: "DateTime", value: FieldDataType.DateTime },
          ]}
          label="Option type"
          size="small"
          sx={{ width: "100px", flexGrow: 0 }}
          variant="standard"
        />
      )}
    </ResponsiveFormRow>
  );
};
