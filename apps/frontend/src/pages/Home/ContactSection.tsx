import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Fade, Paper, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
export const ContactSection = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <Box
      ref={ref}
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
      <Fade in={inView} timeout={2500}>
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
            If you&apos;re a builder, researcher, investor, or member of an online team, we&apos;d
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
      </Fade>
    </Box>
  );
};
