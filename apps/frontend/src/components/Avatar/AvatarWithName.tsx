import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Avatar, AvatarProps } from "./Avatar";

export const AvatarWithName = ({ avatar }: AvatarProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        // width: "100%",
        justifyContent: "left",
        alignItems: "center",
        gap: "6px",
        verticalAlign: "middle",
      }}
    >
      {<Avatar avatar={avatar} size="18px" />}
      <Typography
        fontSize={"1rem"}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {avatar.name}
      </Typography>
    </Box>
  );
};
