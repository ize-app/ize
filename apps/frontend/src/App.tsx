import { ApolloProvider } from '@apollo/client'
import { Global, css } from "@emotion/react";
import { apolloClient } from './apollo'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'
import { CurrentUserProvider } from './contexts/current_user_context'

const GlobalStyles = css`
    html, body, #root, .MuiContainer-root {
         height: 100%;
         margin: 0;
         padding: 0;
    }
`

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Global styles={GlobalStyles} />
      <CurrentUserProvider>
        <RouterProvider router={router} />
      </CurrentUserProvider>
    </ApolloProvider>
  )
}

export default App
