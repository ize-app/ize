import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}

export default App
