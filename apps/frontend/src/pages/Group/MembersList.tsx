import { Box, Typography } from "@mui/material";
import { useState } from "react";

import { AvatarPopper, AvatarWithName } from "@/components/Avatar";
import { EntitySummaryPartsFragment } from "@/graphql/generated/graphql";

export const MembersList = ({ members }: { members: EntitySummaryPartsFragment[] }) => {
  const maxAvatars = 3;
  const numAvatarsToDisplay = members.length <= 3 ? members.length : maxAvatars - 1;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handlePopperOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {members.slice(0, numAvatarsToDisplay).map((avatar) => (
        <AvatarWithName key={avatar.entityId} avatar={avatar} />
      ))}
      {numAvatarsToDisplay !== members.length && (
        <Typography
          variant="description"
          color="textSecondary"
          sx={{ textDecoration: "underline" }}
          onMouseEnter={handlePopperOpen}
          onMouseLeave={handlePopperClose}
        >
          + {members.length - 2} more
        </Typography>
      )}
      <AvatarPopper avatars={members} anchorEl={anchorEl} open={open} />
    </Box>
  );
};
