import { useState } from "react";
import { StytchLogin } from "@stytch/react";
import {
  OAuthProviders,
  Products,
  StytchLoginConfig,
  StyleConfig,
  StytchEvent,
  StytchError,
  Callbacks,
} from "@stytch/vanilla-js";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const config: StytchLoginConfig = {
  products: [Products.oauth, Products.crypto, Products.passwords, Products.emailMagicLinks],
  oauthOptions: {
    providers: [
      {
        type: OAuthProviders.Google,
      },
      {
        type: OAuthProviders.Discord,
        custom_scopes: ["identify", "guilds"],
      },
    ],
    loginRedirectURL: "http://localhost:5173/api/auth?next_route=" + window.location.pathname,
    signupRedirectURL: "http://localhost:5173/api/auth?next_route=" + window.location.pathname,
  },
  passwordOptions: {
    loginRedirectURL: "http://localhost:5173/api/auth?next_route=" + window.location.pathname, //"http://localhost:5173
    resetPasswordRedirectURL: "http://localhost:5173/resetpassword",
    loginExpirationMinutes: 30,
    resetPasswordExpirationMinutes: 30,
  },
  emailMagicLinksOptions: {
    loginRedirectURL: "http://localhost:5173/api/auth?next_route=" + window.location.pathname,
    loginExpirationMinutes: 30,
    signupRedirectURL: "http://localhost:5173/api/auth?next_route=" + window.location.pathname,
    signupExpirationMinutes: 30,
  },
};

const styles: StyleConfig = {
  container: {
    backgroundColor: "#FFFFFF",
    width: "400px",
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
  fontFamily: "Roboto",
  //   hideHeaderText: false,
  logo: {
    logoImageUrl: "",
  },
};

const callBacks: Callbacks = {
  onEvent: (message: StytchEvent) => console.log("Stytch event", message),
  onError: (message: StytchError) => console.log("Stytch error", message),
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button onClick={handleOpen} variant="outlined" color="secondary">
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            borderRadius: "8px",
            border: "1px solid #21005D",
          }}
        >
          <StytchLogin config={config} styles={styles} callbacks={callBacks} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Login;
