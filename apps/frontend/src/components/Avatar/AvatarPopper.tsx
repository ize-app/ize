import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";

import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";

import { AvatarWithName } from "./AvatarWithName";

export const AvatarPopper = ({
  avatars,
  anchorEl,
  open,
}: {
  avatars: (EntityFragment | UserSummaryPartsFragment)[];
  anchorEl: HTMLElement | null;
  open: boolean;
}) => (
  <Popper
    id={"mouse-over-popove-userlist"}
    open={open}
    anchorEl={anchorEl}
    sx={{
      pointerEvents: "none",
    }}
    transition
  >
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350}>
        <Paper
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            gap: "8px",
          }}
          elevation={4}
        >
          {avatars.map((a) => (
            <AvatarWithName avatar={a} />
          ))}
        </Paper>
      </Fade>
    )}
  </Popper>
);
