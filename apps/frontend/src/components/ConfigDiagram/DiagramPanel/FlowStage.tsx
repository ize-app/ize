import { Stage, StageProps } from "./Stage";
import { StageMenu } from "./StageMenu";
import { EntitySummaryPartsFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarGroup } from "@/components/Avatar";
import { Box, Typography } from "@mui/material";
import { WarningOutlined } from "@mui/icons-material";
import { colors } from "@/style/style";

interface FlowStageProps extends StageProps {
  label: string;
  deleteHandler?: () => void;
  entities?: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[];
  hasError?: boolean;
}

export const FlowStage = ({
  label,
  id,
  setSelectedId,
  selectedId,
  deleteHandler,
  entities = [],
  hasError = false,
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
        hasError && <WarningOutlined color={"error"} fontSize="small" sx={{ marginLeft: "8px" }} />
      }
      sx={{
        borderColor: hasError ? colors.error : isSelected ? colors.primary : "rgba(0, 0, 0, 0.1)", // TODO check this actually makes sense
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography variant="label">{label}</Typography>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
        {deleteHandler && <StageMenu deleteHandler={deleteHandler} />}
      </Box>
    </Stage>
  );
};
