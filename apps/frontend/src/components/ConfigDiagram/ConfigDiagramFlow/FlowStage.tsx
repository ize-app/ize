import { WarningOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

import { AvatarGroup } from "@/components/Avatar";
import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { colors } from "@/style/style";

import { Stage, StageProps } from "../DiagramPanel/Stage";
import { StageMenu } from "../DiagramPanel/StageMenu";

interface FlowStageProps extends StageProps {
  label: string;
  subtitle?: string;
  deleteHandler?: () => void;
  entities?: (EntityFragment | UserSummaryPartsFragment)[];
  hasError?: boolean;
  disableDelete?: boolean;
}

export const FlowStage = ({
  label,
  subtitle,
  id,
  setSelectedId,
  selectedId,
  deleteHandler,
  entities = [],
  hasError = false,
  disableDelete = false,
  sx = {},
  icon,
}: FlowStageProps) => {
  const isSelected = selectedId === id;
  return (
    <Stage
      id={id}
      setSelectedId={setSelectedId}
      selectedId={selectedId}
      icon={icon}
      color={colors.primary}
      statusIcon={
        hasError ? (
          <WarningOutlined color={"error"} fontSize="small" sx={{ marginLeft: "8px" }} />
        ) : undefined
      }
      sx={{
        borderColor: hasError ? colors.error : isSelected ? colors.primary : "rgba(0, 0, 0, 0.1)", // TODO check this actually makes sense
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: 1,
          // whiteSpace: "nowrap",
          // overflow: "hidden",
          // textOverflow: "ellipsis",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // whiteSpace: "nowrap",
            // overflow: "hidden",
            // textOverflow: "ellipsis",
            flexGrow: 1,
          }}
        >
          <Typography variant="label">{label}</Typography>
          {subtitle && (
            <Typography
              fontSize={".7rem"}
              lineHeight={"1rem"}
              width={"100%"}
              // sx={{
              //   whiteSpace: "nowrap",
              //   overflow: "hidden",
              //   textOverflow: "ellipsis",
              //   flexGrow: 1,
              // }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
        {deleteHandler && !disableDelete && <StageMenu deleteHandler={deleteHandler} />}
      </Box>
    </Stage>
  );
};
