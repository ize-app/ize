import Typography from "@mui/material/Typography";

import { ActionFragment } from "@/graphql/generated/graphql";

export const ActionFilter = ({ action }: { action: ActionFragment }) => {
  if (!action.filter) return null;
  return (
    <Typography>
      Action will only run for decision &quot;{action.filter.option.name}&quot;
    </Typography>
  );
};
