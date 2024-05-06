import { Stage, StageProps } from "./Stage";
import { EntitySummaryPartsFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarGroup } from "@/components/Avatar";
import { Box, Typography } from "@mui/material";

import { requestStatusProps } from "@/components/status/requestStatusProps";
import { RequestStatus } from "@/components/status/type";

interface RequestStageProps extends StageProps {
  label: string;
  entities?: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[];
  status: RequestStatus;
}

export const RequestStage = ({
  label,
  id,
  setSelectedId,
  selectedId,
  entities = [],
  icon,
  status = RequestStatus.InProgress,
}: RequestStageProps) => {
  const backgroundColor = requestStatusProps[status].backgroundColor;
  const Icon = requestStatusProps[status].icon;
  return (
    <Stage
      id={id}
      setSelectedId={setSelectedId}
      selectedId={selectedId}
      icon={icon}
      color={backgroundColor}
      statusIcon={<Icon fontSize={"medium"} sx={{ color: backgroundColor }} />}
      sx={{ borderColor: backgroundColor }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="label" color={backgroundColor}>
            {label}
          </Typography>
          {status === RequestStatus.InProgress && (
            <Typography color={backgroundColor} fontSize={".7rem"} lineHeight={"1rem"}>
              In progress
            </Typography>
          )}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
      </Box>
    </Stage>
  );
};
