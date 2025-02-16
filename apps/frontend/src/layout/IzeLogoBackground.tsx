import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import logoRepeatUrl from "@/assets/ize-repeat.svg";

export const IzeLogoBackground = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    backgroundSize: "200px",
  },
  backgroundImage: `url(${logoRepeatUrl})`, // Replace with your repeating background image
  backgroundRepeat: "repeat",
  backgroundAttachment: "fixed",
  backgroundPosition: "center",
  backgroundSize: "300px",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
