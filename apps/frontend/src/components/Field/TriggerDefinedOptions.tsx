import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { TriggerDefinedOptions } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";
import { Accordion } from "../Accordion";

export const TriggerDefinedOptionSets = ({
  triggerDefinedOptionSets,
}: {
  triggerDefinedOptionSets: TriggerDefinedOptions[];
}) => {
  if (triggerDefinedOptionSets.length === 0) return null;
  return (
    <Accordion label="The triggerer added options to questions in this request" elevation={0}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {triggerDefinedOptionSets.map((triggerDefinedOptions) => {
          return (
            <Box
              key={"triggeroptions" + triggerDefinedOptions.fieldId}
              sx={{
                display: "flex",
                flexDirection: "column",
                outline: "1px solid rgba(0, 0, 0, 0.1)",
                padding: "2px 6px",
              }}
            >
              <Typography variant="description">{triggerDefinedOptions.fieldName}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {triggerDefinedOptions.options.map((option) => (
                  <FreeInputValue
                    key={option.optionId}
                    value={option.name}
                    type={option.dataType}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Accordion>
  );
};
