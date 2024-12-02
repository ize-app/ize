import Typography from "@mui/material/Typography";

import { ActionFragment } from "@/graphql/generated/graphql";

import { stringifyValue } from "../Value/stringifyValue";

export const ActionFilter = ({ action }: { action: ActionFragment }) => {
  if (!action.filter) return null;
  return (
    <Typography>
      Action will only run for decision &quot;
      {stringifyValue({ value: action.filter.option.value })}&quot;
    </Typography>
  );
};
