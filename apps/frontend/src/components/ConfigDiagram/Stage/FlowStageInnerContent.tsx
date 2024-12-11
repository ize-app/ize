import { Box, Typography } from "@mui/material";

import { StageType } from "./StageType";

export interface StageContentProps {
  label: string;
  subtitle?: string | null | undefined;
}

export const FlowFormStageInnerContent = ({
  type,
  // label,
  // subtitle,
  content,
  color,
}: {
  type: StageType;
  content: StageContentProps[];
  // label: string;
  // subtitle: string;
  color: string;
}) => {
  return type === StageType.ActionFilter ? (
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
        // color={color}
        sx={(theme) => ({
          color: theme.palette.common.black,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        })}
      >
        <span style={{ fontStyle: "italic", color: color }}>Decision filter:</span>{" "}
        {content[0]?.label ?? ""}
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {content.map((item, index) => (
        <Box key={index}>
          <Typography variant="label" color={color}>
            {item.label}
          </Typography>
          {item.subtitle && (
            <Typography fontSize={".75rem"} lineHeight={"1rem"} width={"100%"}>
              {item.subtitle}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
