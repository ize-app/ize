import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { MePartsFragment } from "@/graphql/generated/graphql";

import { UserDropDown } from "./UserDropDown";
import { LoginButton } from "../Auth/LoginButton";

export const NavBar = ({
  handleMenuToggle,
  me,
}: {
  handleMenuToggle: () => void;
  me: MePartsFragment | undefined | null;
}) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        border: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          display: "flex",
          alignItems: "center",
          height: "40px",
          justifyContent: "space-between",
          paddingRight: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1rem" }}>
          {me && (
            <IconButton
              color="primary"
              size="small"
              aria-label="open drawer"
              onClick={handleMenuToggle}
              edge="start"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <img
            src="./ize-logo-textonly.svg"
            style={{
              height: "40px",
            }}
          />
        </Box>
        {me ? <UserDropDown me={me} /> : <LoginButton />}
      </Toolbar>
    </AppBar>
  );
};
