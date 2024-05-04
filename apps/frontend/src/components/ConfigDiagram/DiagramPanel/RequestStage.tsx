import { Stage, StageProps } from "./Stage";
import { EntitySummaryPartsFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarGroup } from "@/components/Avatar";
import { Box, Typography } from "@mui/material";

import { getStatusColor } from "@/components/Status/getStatusColor";
import { Status } from "@/components/Status/type";
import { getStatusIcon } from "@/components/Status/getStatusIcon";

interface RequestStageProps extends StageProps {
  label: string;
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
  status = Status.InProgress,
}: RequestStageProps) => {
  const color = getStatusColor(status);
  return (
    <Stage
      id={id}
      setSelectedId={setSelectedId}
      selectedId={selectedId}
      icon={icon}
      color={color}
      statusIcon={getStatusIcon(status)}
      sx={{ borderColor: color }}
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
          <Typography variant="label" color={color}>
            {label}
          </Typography>
          {status === Status.InProgress && (
            <Typography color={color} fontSize={".7rem"} lineHeight={"1rem"}>
              In progress
            </Typography>
          )}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
      </Box>
    </Stage>
  );
};
