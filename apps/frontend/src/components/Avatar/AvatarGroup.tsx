import MuiAvatarGroup from "@mui/material/AvatarGroup";

import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";

import { Avatar } from "./Avatar";
// import { useState } from "react";

export interface AvatarProps {
  avatars: (EntityFragment | UserSummaryPartsFragment)[];
  size?: string;
}

export const AvatarGroup = ({ avatars, size }: AvatarProps) => {
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);

  // const handlePopperOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handlePopperClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      <MuiAvatarGroup
        max={3}
        total={avatars.length}
        sx={{
          "& .MuiAvatarGroup-avatar": {},
        }}
        aria-haspopup="true"
        spacing={22}
        // onMouseEnter={handlePopperOpen}
        // onMouseLeave={handlePopperClose}
      >
        {avatars.map((a) => {
          return <Avatar avatar={a} size={size} key={a.id} />;
        })}
      </MuiAvatarGroup>
      {/* <AvatarPopper avatars={avatars} anchorEl={anchorEl} open={open} /> */}
    </>
  );
};
