import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { StytchLogin } from "@stytch/react";
import {
  Callbacks,
  OAuthProviders,
  Products,
  StyleConfig,
  StytchError,
  StytchEvent,
  StytchEventType,
  StytchLoginConfig,
} from "@stytch/vanilla-js";
import { useCallback, useContext } from "react";

import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

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
    loginRedirectURL: `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`,
    signupRedirectURL: `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`,
  },
  passwordOptions: {
    loginRedirectURL: `${window.location.origin}/api/auth/password?next_route=${window.location.pathname}`,
    resetPasswordRedirectURL: `${window.location.origin}/resetpassword`,
    loginExpirationMinutes: 30,
    resetPasswordExpirationMinutes: 30,
  },
  emailMagicLinksOptions: {
    loginRedirectURL: `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`,
    loginExpirationMinutes: 30,
    signupRedirectURL: `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`,
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

  const loadMe = useCallback(() => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  }, [refetch]);

  // Oauth/Magiclink are already redirected to backend endpoint by stytch
  // so these callbacks call backend for crypto wallets / passwords to create the identity if it doesn't exist already
  const callBacks: Callbacks = {
    onEvent: async (message: StytchEvent) => {
      switch (message.type) {
        case StytchEventType.CryptoWalletAuthenticate:
          await fetch("/api/auth/crypto", { method: "POST" });
          loadMe();
          return;
        case StytchEventType.PasswordCreate:
        case StytchEventType.PasswordAuthenticate:
          await fetch("/api/auth/password", { method: "POST" });
          loadMe();
          return;
      }
    },
    // TODO: set error message toast for this
    onError: (message: StytchError) => console.log("Stytch authentication error:", message.message),
  };

  return (
    <Modal
      open={authModalOpen}
      onClose={() => {
        setAuthModalOpen(false);
      }}
      aria-labelledby="login-modal"
      aria-describedby="login-modal"
    >
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          borderRadius: "8px",
          border: "1px solid #21005D",
        }}
      >
        <StytchLogin config={config} styles={styles} callbacks={callBacks} />
        <div
          className="login-footer"
          style={{ backgroundColor: "white", maxWidth: "400px", padding: "6px" }}
        >
          By signing in, you agree to our{" "}
          <a href="/terms" target="_blank" rel="noopener">
            Terms of Service
          </a>{" "}
          and acknowledge our{" "}
          <a href="/privacy" target="_blank" rel="noopener">
            Privacy Policy
          </a>
          .
        </div>
      </Box>
    </Modal>
  );
};

export default LoginModal;
