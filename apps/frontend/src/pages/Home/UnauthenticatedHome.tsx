import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Fade, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import izeLogoUrl from "@/assets/ize-logo-circle.svg";
import { LoginButton } from "@/components/Auth/LoginButton";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";

import { InfoBoxesSection } from "./InfoBoxesSection";

const UnauthenticatedHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      <Box
        sx={(theme) => ({
          height: "25vh",
          display: "flex",
          [theme.breakpoints.down("sm")]: {
            height: "80vh",
          },
          padding: "64px 0px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          textAlign: "center",
          px: 2,
        })}
      >
        {isSmallScreenSize && (
          <Box component="img" src={izeLogoUrl} alt="Ize Logo" sx={{ width: 300, mb: 4 }} />
        )}
        <Fade in={true} timeout={500}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography
              variant="h1"
              fontSize={isSmallScreenSize ? "2.25rem" : "3rem"}
              sx={{
                fontFamily: "Sora",
                mt: 2,
                mb: 2,
              }}
            >
              The collective process platform
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Sora",
                fontWeight: 400,
                mb: 4,
              }}
              color={"secondary"}
            >
              How distributed teams scale, share power, and harness collective intelligence
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  navigate("/about");
                }}
                size="small"
                sx={{ width: "120px" }}
              >
                Learn more
              </Button>
              <LoginButton sx={{ width: "120px" }}>Get started</LoginButton>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Parallax Section with Embedded Vimeo Video */}

      <Fade in={true} timeout={500}>
        <IzeLogoBackground
          sx={(theme) => ({
            height: "55vh",
            [theme.breakpoints.down("sm")]: {
              height: "40vh",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              position: "relative",
              width: "80%",
              height: "80%",
              [theme.breakpoints.down("sm")]: {
                width: "90%",
                height: "90%",
              },
            })}
          >
            <iframe
              src="https://player.vimeo.com/video/1056860875?badge=0&autopause=0&player_id=0&app_id=58479" // Replace with your Vimeo video ID
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Embedded Vimeo Video"
            />
          </Box>
        </IzeLogoBackground>
      </Fade>
      <InfoBoxesSection />

      <Box
        sx={{
          backgroundColor: "#EADDFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 4,
        }}
      >
        <Paper
          elevation={2}
          sx={(theme) => ({
            [theme.breakpoints.down("sm")]: {
              width: "90%",
              height: "90%",
              flexDirection: "column",
            },

            display: "flex",
            flexDirection: "row",
            padding: "20px 8px",
            gap: "12px",
            height: "200px",
            alignItems: "center",
            justifyContent: "space-around",
            border: "1px solid #EADDFF",
          })}
        >
          <Typography
            variant="h6"
            color="primary"
            fontFamily="Sora"
            sx={(theme) => ({
              width: "50%",
              padding: "12px",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
                textAlign: "center",
              },
            })}
          >
            {" "}
            If you&apos;re a builder, investor, or member of a distributed online team, we&apos;d
            love to hear from you.{" "}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="mailto:harmon@ize.space"
            endIcon={<MailOutlineIcon />}
          >
            Get in touch
          </Button>
        </Paper>
      </Box>
    </div>
  );
};

export default UnauthenticatedHome;
