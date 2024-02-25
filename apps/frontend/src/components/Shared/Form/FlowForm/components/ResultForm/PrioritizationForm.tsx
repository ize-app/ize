import { UseFormReturn } from "react-hook-form";

import { TextField } from "../../../FormFields";

import { ResponsiveFormRow } from "../ResponsiveFormRow";

import { FlowSchemaType } from "../../formValidation/flow";
import { ResultType } from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { InputAdornment } from "@mui/material";

interface PrioritizationFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const PrioritizationForm = ({ formMethods, formIndex }: PrioritizationFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.result.type`, ResultType.Prioritization);
  }, []);

  return (
    <>
      <ResponsiveFormRow>
        <TextField<FlowSchemaType>
          control={formMethods.control}
          width="300px"
          label="# of options in final result"
          variant="standard"
          size="small"
          showLabel={false}
          name={`steps.${formIndex}.result.prioritization.numOptionsToInclude`}
          endAdornment={<InputAdornment position="end">top options in final result</InputAdornment>}
        />
      </ResponsiveFormRow>
    </>
  );
};
