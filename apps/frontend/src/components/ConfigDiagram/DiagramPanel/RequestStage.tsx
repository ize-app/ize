import { Stage, StageProps } from "./Stage";
import { EntitySummaryPartsFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarGroup } from "@/components/Avatar";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import muiTheme from "@/style/muiTheme";

export enum RequestStageStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
}

interface RequestStageProps extends StageProps {
  label: string;
  entities?: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[];
  status: RequestStageStatus;
}

const getStatusColor = (status: RequestStageStatus) => {
  switch (status) {
    case RequestStageStatus.Pending:
      return muiTheme.palette.secondary.main;
    case RequestStageStatus.InProgress:
      return muiTheme.palette.info.main;
    case RequestStageStatus.Completed:
      return muiTheme.palette.success.main;
    default:
      return muiTheme.palette.primary.main;
  }
};

const getStatusIcon = (status: RequestStageStatus) => {
  switch (status) {
    case RequestStageStatus.Pending:
      return (
        <RadioButtonUncheckedOutlinedIcon
          fontSize={"medium"}
          sx={{ color: getStatusColor(status) }}
        />
      );
    case RequestStageStatus.InProgress:
      return <TimerOutlinedIcon fontSize={"medium"} sx={{ color: getStatusColor(status) }} />;
    case RequestStageStatus.Completed:
      return (
        <CheckCircleOutlineOutlinedIcon
          fontSize={"medium"}
          sx={{ color: getStatusColor(status) }}
        />
      );
    default:
      return (
        <HourglassTopOutlinedIcon fontSize={"medium"} sx={{ color: getStatusColor(status) }} />
      );
  }
};

export const RequestStage = ({
  label,
  id,
  setSelectedId,
  selectedId,
  entities = [],
  icon,
  status = RequestStageStatus.InProgress,
}: RequestStageProps) => {
  return (
    <Stage
      id={id}
      setSelectedId={setSelectedId}
      selectedId={selectedId}
      icon={icon}
      statusIcon={getStatusIcon(status)}
      sx={{ borderColor: getStatusColor(status) }}
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
          <Typography variant="label">{label}</Typography>
          {status === RequestStageStatus.InProgress && (
            <Typography
              color={getStatusColor(RequestStageStatus.InProgress)}
              fontSize={".7rem"}
              lineHeight={"1rem"}
            >
              In progress
            </Typography>
          )}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
      </Box>
    </Stage>
  );
};
