import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AvatarGroup } from "@/components/Avatar";

import {
  EntitySummaryPartsFragment,
  UserSummaryPartsFragment,
} from "../../../graphql/generated/graphql";

export const RequestStepTitle = ({
  flowName,
  requestName,
  creator,
  totalSteps,
  stepIndex,
}: {
  flowName: string;
  requestName: string;
  creator: EntitySummaryPartsFragment | UserSummaryPartsFragment;
  totalSteps: number;
  stepIndex: number;
}) => {
  const stepProgress = totalSteps > 1 ? ` (Step ${stepIndex + 1} of ${totalSteps})` : ``;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <Typography
        variant="description"
        color="primary"
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "1",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {flowName}
      </Typography>
      <Box sx={{ display: "flex", gap: "8px" }}>
        {creator && <AvatarGroup avatars={[creator]} size="16px" />}
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {requestName + stepProgress}
        </Typography>
      </Box>
    </Box>
  );
};
