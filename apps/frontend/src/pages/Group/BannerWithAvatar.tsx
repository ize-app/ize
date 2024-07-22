import { SxProps, Theme } from "@mui/material";
import MuiAvatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import { getAvatarString } from "@/components/Avatar/getAvatarString";
import { stringToColor } from "@/components/Avatar/stringToColor";

import { ParentProps } from "../../components/AvatarOld";

interface BannerWithIconProps {
  id: string;
  bannerUrl: string;
  avatarUrl: string;
  name: string;
  parent: ParentProps | undefined;
  color: string | null | undefined;
}

const BannerWithAvatar = ({
  id,
  bannerUrl,
  avatarUrl,
  name,
  color,
}: BannerWithIconProps): JSX.Element => {
  const avatarStyles = (theme: Theme): SxProps => ({
    bgcolor: color ? color : stringToColor(id),
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
          maxHeight: "200px", //300px
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
                background: `linear-gradient(0deg, ${stringToColor(id)} 40%, ${
                  color ? color : stringToColor(id.repeat(2))
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
          <MuiAvatar src={avatarUrl} sx={avatarStyles as SxProps}>
            {getAvatarString(name.toUpperCase())}
          </MuiAvatar>
          {/* //   </Box></Box>Badge
            //   overlap="circular"
            //   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            //   badgeContent={
            //     <MuiAvatar
            //       alt={name}
            //       src={parent.avatarUrl ?? undefined}
            //       sx={(theme) => ({
            //         border: "2px solid white",
            //         [theme.breakpoints.up("sm")]: {
            //           width: "3rem",
            //           height: "3rem",
            //         },
            //         [theme.breakpoints.down("sm")]: {
            //           width: "2rem",
            //           height: "2rem",
            //         },
            //       })}
            //     >
            //       {getAvatarString(name.toUpperCase())}
            //     </MuiAvatar>
            //   }
            // >
            //   <MuiAvatar src={avatarUrl} sx={avatarStyles as SxProps}>
            //     {getAvatarString(name.toUpperCase())}
            //   </MuiAvatar>
            // </Badge> */}
        </Box>
      </Box>
    </>
  );
};

export default BannerWithAvatar;
