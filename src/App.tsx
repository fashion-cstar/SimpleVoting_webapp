import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ToastContainer } from 'react-toastify'
import {
  ContractProvider,
  VotingFactoryProvider,
  WalletProvider,
} from 'contexts'
import { useProcessing } from 'contexts'
import { Header } from 'components'
import { Redirect, Route, Switch } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from "./styles/theme"
import LoadingModal from 'components/LoadingModal'
import { VotingDetail } from './pages/Detail'
import { VotingPolls } from './pages/HomePage'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh'
  },
}))

function App() {
  const classes = useStyles()
  const { isProcessing } = useProcessing()
  const getLibrary = (provider: any) => {
    const library = new Web3Provider(provider)
    library.pollingInterval = 8000
    return library
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractProvider>
        <WalletProvider>
          <VotingFactoryProvider>
            <ThemeProvider theme={theme}>
              <main className={classes.root}>
                <LoadingModal isOpen={isProcessing} />
                <div className="w-full">
                  <Header />
                  <Switch>
                    <Route exact path="/" component={VotingPolls} />
                    <Route exact path="/:voteId" component={VotingDetail} />
                    <Redirect to="/" />
                  </Switch>
                </div>
              </main>
              <ToastContainer />
            </ThemeProvider>
          </VotingFactoryProvider>
        </WalletProvider>
      </ContractProvider>
    </Web3ReactProvider>
  )
}

export default App
