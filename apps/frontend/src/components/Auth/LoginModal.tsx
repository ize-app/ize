import { useContext } from "react";
import { StytchLogin } from "@stytch/react";
import {
  OAuthProviders,
  Products,
  StytchLoginConfig,
  StyleConfig,
  StytchEvent,
  StytchError,
  Callbacks,
  StytchEventType,
} from "@stytch/vanilla-js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { CurrentUserContext } from "@/contexts/current_user_context";

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
    loginRedirectURL: "http://localhost:5173/api/auth/token?next_route=" + window.location.pathname,
    signupRedirectURL:
      "http://localhost:5173/api/auth/token?next_route=" + window.location.pathname,
  },
  passwordOptions: {
    loginRedirectURL:
      "http://localhost:5173/api/auth/password?next_route=" + window.location.pathname, //"http://localhost:5173
    resetPasswordRedirectURL: "http://localhost:5173/resetpassword",
    loginExpirationMinutes: 30,
    resetPasswordExpirationMinutes: 30,
  },
  emailMagicLinksOptions: {
    loginRedirectURL: "http://localhost:5173/api/auth/token?next_route=" + window.location.pathname,
    loginExpirationMinutes: 30,
    signupRedirectURL:
      "http://localhost:5173/api/auth/token?next_route=" + window.location.pathname,
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

const LoginModal = () => {
  const { refetch, authModalOpen, setAuthModalOpen } = useContext(CurrentUserContext);

  // Oauth/Magiclink are already redirected to backend endpoint by stytch
  // so these callbacks call backend for crypto wallets / passwords to create the identity if it doesn't exist already
  const callBacks: Callbacks = {
    onEvent: async (message: StytchEvent) => {
      switch (message.type) {
        case StytchEventType.CryptoWalletAuthenticate:
          await fetch("/api/auth/crypto", { method: "POST" });
          if (refetch) {
            await refetch();
          }
          return;
        case StytchEventType.PasswordCreate:
          await fetch("/api/auth/password", { method: "POST" });
          if (refetch) {
            await refetch();
          }
          return;
      }
    },
    // TODO: set error message toast for this
    onError: (message: StytchError) => console.log("Stytch authentication error:", message.message),
  };

  return (
    <Modal
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      aria-labelledby="login-modal"
      aria-describedby="login-modal"
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
  );
};

export default LoginModal;
