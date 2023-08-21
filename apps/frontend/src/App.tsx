import { ApolloProvider } from '@apollo/client'
import './App.css'
import { Users } from './components/Users'
import { apolloClient } from './apollo'
import { ConnectToDiscord } from './components/ConnectToDiscord'
import { LoggedInUser } from './components/LoggedInUser'
import { AddToServer } from './components/AddToServer'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <h1>Cults</h1>
      <Users />
      <ConnectToDiscord />
      <LoggedInUser />
      <AddToServer />
    </ApolloProvider>
  )
}

export default App
