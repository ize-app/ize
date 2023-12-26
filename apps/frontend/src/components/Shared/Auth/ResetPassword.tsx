import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Products, StyleConfig, StytchLoginConfig } from "@stytch/vanilla-js";
import { StytchPasswordReset } from "@stytch/react";

const config: StytchLoginConfig = {
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: "http://localhost:5173/api/auth", // http://localhost:5173
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: "http://localhost:5173/resetpassword",
  },
  products: [Products.passwords, Products.emailMagicLinks],
};

const style: StyleConfig = {
  hideHeaderText: true,
  fontFamily: "Roboto",
  container: {
    backgroundColor: "transparent",
    width: "500px",
    borderColor: "none",
  },
  colors: {
    primary: "#6750A4",
    secondary: "#5C727D",
    success: "#0C5A56",
    error: "#8B1214",
  },
  buttons: {
    primary: {
      backgroundColor: "#6750A4",
      textColor: "#FFFFFF",
      borderColor: "#19303D",
      borderRadius: "4px",
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      textColor: "#19303D",
      borderColor: "#19303D",
      borderRadius: "4px",
    },
  },
};

export const ResetPassword = () => {
  const [passwordResetToken, setPasswordResetToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    setPasswordResetToken(token ?? "");
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StytchPasswordReset config={config} passwordResetToken={passwordResetToken} styles={style} />
    </Box>
  );
};
