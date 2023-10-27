import { SxProps, Theme } from "@mui/material";
import MuiAvatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import { avatarString, stringToColor } from "../../utils/inputs";
import { UserDataProps } from "../shared/Avatar";

interface BannerWithIconProps {
  bannerUrl: string;
  avatarUrl: string;
  name: string;
  parent: UserDataProps | undefined;
  color: string | null | undefined;
}

const BannerWithAvatar = ({
  bannerUrl,
  avatarUrl,
  name,
  parent,
  color,
}: BannerWithIconProps): JSX.Element => {
  const avatarStyles = (theme: Theme): SxProps => ({
    bgcolor: color ? color : stringToColor(name),
    borderRadius: "20px",
    fontWeight: "600",
    letterSpacing: ".2rem",
    [theme.breakpoints.up("sm")]: {
      width: "10rem",
      height: "10rem",
      fontSize: "3rem",
      border: "6px solid white",
    },
    [theme.breakpoints.down("sm")]: {
      width: "4rem",
      height: "4rem",
      fontSize: "1rem",
      border: "4px solid white",
    },
  });
  return (
    <>
      <Box
        sx={{
          position: "relative",
          maxHeight: "300px",
          minHeight: "5rem",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            paddingBottom: "25%",
            position: "relative",
            minHeight: "3rem",
            height: "0px",
          }}
        >
          <Box
            component="span"
            sx={{
              boxSizing: "border-box",
              display: "box",
              overflow: "hidden",
              width: "initial",
              height: "initial",
              background: "none",
              position: "absolute",
              inset: "0px",
              margin: "0px",
              padding: "0px",
              border: "0px",
            }}
          >
            <Box
              component="img"
              src={bannerUrl}
              sx={{
                background: `linear-gradient(0deg, ${stringToColor(name)} 0%, ${
                  color ? color : stringToColor(name.repeat(2))
                } 100%)`,
                objectFit: "cover",
                minWidth: "100%",
                maxWidth: "100%",
                minHeight: "100%",
                maxHeight: "100%",
                height: "0px",
                width: "0px",
                border: "none",
                inset: "0px",
                display: "block",
                margin: "auto",
                position: "absolute",
                boxSizing: "border-box",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up("sm")]: {
            marginTop: "-8rem",
          },
          [theme.breakpoints.down("sm")]: {
            marginTop: "-4rem",
          },
          paddingLeft: "1rem",
        })}
      >
        <Box>
          {parent ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <MuiAvatar
                  alt={name}
                  src={parent.avatarUrl}
                  children={avatarString(name.toUpperCase())}
                  sx={(theme) => ({
                    border: "2px solid white",
                    [theme.breakpoints.up("sm")]: {
                      width: "4rem",
                      height: "4rem",
                    },
                    [theme.breakpoints.down("sm")]: {
                      width: "2rem",
                      height: "2rem",
                    },
                  })}
                />
              }
            >
              <MuiAvatar
                src={avatarUrl}
                children={avatarString(name.toUpperCase())}
                sx={avatarStyles as SxProps}
              />
            </Badge>
          ) : (
            <MuiAvatar
              src={avatarUrl}
              children={avatarString(name.toUpperCase())}
              sx={avatarStyles as SxProps}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default BannerWithAvatar;
