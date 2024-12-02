import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { TriggerDefinedOptionsFragment } from "@/graphql/generated/graphql";

import { Accordion } from "../Accordion";
import { Value } from "../Value/Value";

export const TriggerDefinedOptionSets = ({
  triggerDefinedOptionSets,
}: {
  triggerDefinedOptionSets: TriggerDefinedOptionsFragment[];
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
                  <Value key={option.optionId} value={option.value} type={"option"} />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Accordion>
  );
};
