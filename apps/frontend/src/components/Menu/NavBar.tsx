import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { MePartsFragment } from "@/graphql/generated/graphql";

import { UserDropDown } from "./UserDropDown";

export const NavBar = ({
  handleMenuToggle,
  me,
}: {
  handleMenuToggle: () => void;
  me: MePartsFragment;
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="primary"
            size="small"
            aria-label="open drawer"
            onClick={handleMenuToggle}
            edge="start"
            sx={{
              width: "60px",
              // mr: 2,
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <img
            src="./ize-logo-textonly.svg"
            style={{
              height: "40px",
            }}
          />
        </Box>
        <UserDropDown me={me} />
      </Toolbar>
    </AppBar>
  );
};
