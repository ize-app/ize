import Box from "@mui/material/Box";
import { Variant } from "@mui/material/styles/createTypography";
import Typography from "@mui/material/Typography";

import { Avatar, AvatarProps } from "./Avatar";

interface AvatarWithNameProps extends AvatarProps {
  typography?: Variant | "description";
  fontSize?: string;
}

export const AvatarWithName = ({
  avatar,
  fontSize,
  typography,
}: AvatarWithNameProps): JSX.Element => {
  const fontSizeOverride = fontSize ?? "16px";
  const avatarSize = (parseInt(fontSizeOverride, 10) * 1.25).toString() + "px";

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
      {<Avatar avatar={avatar} size={avatarSize} />}
      <Typography
        fontSize={fontSizeOverride}
        variant={typography ?? "body1"}
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
