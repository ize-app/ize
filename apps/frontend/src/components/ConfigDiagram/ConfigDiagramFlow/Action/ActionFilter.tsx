import { ActionFragment } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";

export const ActionFilter = ({ action }: { action: ActionFragment }) => {
  if (!action.filterOption) return null;
  return <Typography>Action will only run for decision "{action.filterOption.name}"</Typography>;
};
