import { ApolloProvider } from "@apollo/client";
import { Global } from "@emotion/react";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";

import { ThemeProvider } from "@mui/material/styles";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { apolloClient } from "./apollo";
import { CurrentUserProvider } from "./contexts/current_user_context";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { router } from "./routers/router";
import GlobalStyles from "./style/global";
import muiTheme from "./style/muiTheme";
const stytch = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN);

function App() {
  return (
    <StytchProvider stytch={stytch}>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider>
          <Global styles={GlobalStyles} />
          <ThemeProvider theme={muiTheme}>
            <CurrentUserProvider>
              <SnackbarProvider>
                <RouterProvider router={router} />
              </SnackbarProvider>
            </CurrentUserProvider>
          </ThemeProvider>
        </HelmetProvider>
      </ApolloProvider>
    </StytchProvider>
  );
}

export default App;
