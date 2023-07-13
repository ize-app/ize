import { ApolloProvider } from '@apollo/client'
import './App.css'
import { Users } from './components/Users'
import { apolloClient } from './apollo'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <h1>Cults</h1>
      <Users />
    </ApolloProvider>
  )
}

export default App
