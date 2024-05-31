import Typography from "@mui/material/Typography";
import { UseFormReturn } from "react-hook-form";

import { Select } from "@/components/Form/formFields";
import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { ResponsiveFormRow } from "@/components/Form/formLayout/ResponsiveFormRow";
import { FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { ResultListCountLimit } from "../../formValidation/result";

interface PrioritizationFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number;
  resultIndex: number;
  field: FieldSchemaType;
  display?: boolean;
}

const maxListItemsOptions = [
  { name: "1 options", value: 1 },
  { name: "2 options", value: 2 },
  { name: "3 options", value: 3 },
  { name: "4 options", value: 4 },
  { name: "5 options", value: 5 },
  { name: "No limit", value: ResultListCountLimit.None },
];

const rankingStrategyDescription = (selectionType: FieldOptionsSelectionType) => {
  switch (selectionType) {
    case FieldOptionsSelectionType.Select:
      return "Ranking determined by number of times option is selected";
    case FieldOptionsSelectionType.MultiSelect:
      return "Ranking determined by number of times option is selected";
    case FieldOptionsSelectionType.Rank:
      return "Ranking determined by weighted average of individual rankings";
  }
};

export const PrioritizationForm = ({
  formMethods,
  formIndex,
  resultIndex,
  field,
  display = true,
}: PrioritizationFormProps) => {
  return (
    <FieldBlock sx={{ display: display ? "flex" : "none" }}>
      <Typography variant={"label2"}>Ranking configuration</Typography>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="# of options in the final result"
          // defaultValue={""}
          renderValue={(val) => {
            if (val === ResultListCountLimit.None)
              return "All options included in the final ranking";
            const option = maxListItemsOptions.find((option) => option.value === val);
            return "Top " + option?.name + " included in the final ranking";
          }}
          selectOptions={maxListItemsOptions}
          name={`steps.${formIndex}.result.${resultIndex}.prioritization.numPrioritizedItems`}
          displayLabel={false}
          size={"small"}
          defaultValue=""
        />
      </ResponsiveFormRow>
      <Typography>
        {field.type === FieldType.Options
          ? rankingStrategyDescription(field.optionsConfig.selectionType)
          : null}
      </Typography>
    </FieldBlock>
  );
};
