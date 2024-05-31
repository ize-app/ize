import Typography from "@mui/material/Typography";

import { ActionFragment } from "@/graphql/generated/graphql";

export const ActionFilter = ({ action }: { action: ActionFragment }) => {
  if (!action.filterOption) return null;
  return (
    <Typography>Action will only run for decision &quot;{action.filterOption.name}&quot;</Typography>
  );
};
