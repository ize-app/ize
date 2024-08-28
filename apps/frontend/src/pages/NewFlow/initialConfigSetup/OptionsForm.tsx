import { Typography } from "@mui/material";
// import { useFormContext } from "react-hook-form";

import { FieldBlock } from "./FieldBlock";
import { ButtonGroupField } from "../ButtonGroupField";
import { IntitialFlowSetupSchemaType, OptionsType } from "../formValidation";

export const OptionsForm = () => {
  //   const { control, watch } = useFormContext<IntitialFlowSetupSchemaType>();

  return (
    <>
      <FieldBlock>
        <Typography variant="description">What options are you deciding between?</Typography>
        <ButtonGroupField<IntitialFlowSetupSchemaType>
          label="Test"
          name={`decision.optionsType`}
          options={[
            {
              name: "Preset options",
              value: OptionsType.Preset,
            },
            {
              name: "Options created when triggered",
              value: OptionsType.Trigger,
            },
            {
              name: "Ask community for option ideas",
              value: OptionsType.PrevStep,
            },
          ]}
        />
      </FieldBlock>
    </>
  );
};
