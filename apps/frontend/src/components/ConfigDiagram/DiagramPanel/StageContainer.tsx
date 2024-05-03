import { WarningOutlined } from "@mui/icons-material";
import { Box, Paper, SxProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { colors } from "@/style/style";
import { StageMenu } from "./StageMenu";
import { EntitySummaryPartsFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarGroup } from "@/components/Avatar";

interface StageContainerProps {
  label: string;
  id: string;
  children?: React.ReactNode;
  sx?: SxProps;
  hasError?: boolean;
  icon?: any;
  deleteHandler?: () => void;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
  selectedId: string | false;
  entities?: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[];
}

export const StageContainer = ({
  label,
  id,
  children,
  setSelectedId,
  selectedId,
  deleteHandler,
  hasError = false,
  icon,
  entities = [],
  sx = {},
}: StageContainerProps) => {
  const isSelected = selectedId === id;
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: hasError ? "28px" : "0px",
          minHeight: "48px",
          border: "1px solid",
          borderWidth: isSelected ? "2px" : "1px",

          borderColor: hasError ? colors.error : isSelected ? colors.primary : "rgba(0, 0, 0, 0.1)",
          width: "240px",
          padding: "8px",
          "&&:hover": {
            boxShadow: `0px 0px 0px 2px ${colors.primaryContainer} inset`,
          },
          ...sx,
        }}
      >
        <Box sx={{ marginRight: "12px", display: "flex" }}>{icon}</Box>
        <Box
          onClick={() => {
            setSelectedId(id);
          }}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <Typography color="primary">{label}</Typography>
          {children}
        </Box>
        {entities.length > 0 && <AvatarGroup avatars={entities} />}
        {deleteHandler && <StageMenu deleteHandler={deleteHandler} />}
      </Paper>
      {hasError && <WarningOutlined color={"error"} fontSize="small" sx={{ marginLeft: "8px" }} />}
    </Box>
  );
};
