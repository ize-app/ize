import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AvatarGroup } from "@/components/Avatar";

import { RequestSummaryFragment } from "../../../graphql/generated/graphql";

export const RequestStepTitle = ({ request }: { request: RequestSummaryFragment }) => {
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
        {`${request.flowName}`}
      </Typography>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <AvatarGroup avatars={[request.creator]} size="16px" />
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {request.requestName}
        </Typography>
      </Box>
    </Box>
  );
};
