import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'
import { CurrentUserProvider } from './contexts/current_user_context'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <CurrentUserProvider>
        <RouterProvider router={router} />
      </CurrentUserProvider>
    </ApolloProvider>
  )
}

export default App
