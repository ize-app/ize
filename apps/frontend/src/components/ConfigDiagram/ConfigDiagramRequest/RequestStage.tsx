import { Box, Typography } from "@mui/material";

import { AvatarGroup } from "@/components/Avatar";
import { statusProps } from "@/components/status/statusProps";
import {
  EntitySummaryPartsFragment,
  Status,
  UserSummaryPartsFragment,
} from "@/graphql/generated/graphql";

import { Stage, StageProps } from "../DiagramPanel/Stage";

interface RequestStageProps extends StageProps {
  label: string;
  subtitle?: string;
  entities?: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[];
  status: Status;
}

export const RequestStage = ({
  label,
  id,
  setSelectedId,
  selectedId,
  entities = [],
  icon,
  subtitle,
  status = Status.InProgress,
}: RequestStageProps) => {
  const backgroundColor = statusProps[status].backgroundColor;
  const Icon = statusProps[status].icon;
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
          <Typography color={backgroundColor} fontSize={".7rem"} lineHeight={"1rem"}>
            {subtitle}
          </Typography>
          {/* {status === Status.InProgress && (
            <Typography color={backgroundColor} fontSize={".7rem"} lineHeight={"1rem"}>
              In progress
            </Typography>
          )} */}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
      </Box>
    </Stage>
  );
};
