import { ApolloProvider } from '@apollo/client'
import { Global } from "@emotion/react";
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './style/muiTheme';
import { apolloClient } from './apollo'
import GlobalStyles from './style/global';
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'
import { CurrentUserProvider } from './contexts/current_user_context'


function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Global styles={GlobalStyles} />
      <ThemeProvider theme={muiTheme}>
      <CurrentUserProvider>
        <RouterProvider router={router} />
      </CurrentUserProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
