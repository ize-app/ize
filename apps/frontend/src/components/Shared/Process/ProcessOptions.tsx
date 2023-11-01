import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { ProcessOption as ProcessOptionType } from "../../../graphql/generated/graphql";

export const ProcessOptions = ({
  options,
}: {
  options: ProcessOptionType[];
}) => (
  <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
    {options.map((option) => (
      <Chip label={option.value} key={option.id} sx={{ minWidth: "50px" }} />
    ))}
  </Box>
);
