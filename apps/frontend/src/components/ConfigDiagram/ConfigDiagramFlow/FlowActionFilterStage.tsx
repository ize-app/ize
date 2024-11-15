import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box, SvgIconProps, Typography, useTheme } from "@mui/material";

import { ActionFragment } from "@/graphql/generated/graphql";

import { Stage, StageProps } from "../DiagramPanel/Stage";

export interface FlowActionFilterStageProps extends StageProps {
  action: ActionFragment | undefined | null;
  color?: string;
  statusIcon?: React.ComponentType<SvgIconProps>;
}

export const FlowActionFilterStage = ({
  id,
  setSelectedId,
  selectedId,
  color,
  statusIcon,
  action,
}: FlowActionFilterStageProps) => {
  if (!action?.filterOption) return null;

  const label: string = action.filterOption.name;
  const icon: React.ComponentType<SvgIconProps> | undefined = FilterAltIcon;

  const theme = useTheme();

  return (
    <Box sx={{ height: "48px", position: "relative", display: "flex", alignItems: "flex-end" }}>
      <Box
        sx={(theme) => ({
          position: "absolute",
          height: "20px",
          width: "2px",
          backgroundColor: theme.palette.grey[400],
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
        })}
      />
      <Stage
        id={id}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        color={color ?? theme.palette.primary.main}
        statusIcon={statusIcon}
        icon={icon}
        size="small"
        sx={{ zIndex: 1, minHeight: "24px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              maxWidth: "200px",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="description"
              lineHeight={"1rem"}
              width={"100%"}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ fontStyle: "italic" }}>Decision filter:</span> {label}
            </Typography>
          </Box>
        </Box>
      </Stage>
    </Box>
  );
};
