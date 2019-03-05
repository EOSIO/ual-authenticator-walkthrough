import React, { Component } from 'react'
import { Ledger } from 'authenticator'
import { UALProvider, withUAL } from '@blockone/universal-authenticator-library-react'

const chainId = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
const rpcEndpoints = [{
  protocol: "https",
  host: "jungle2.cryptolions.io",
  port: 443
}]

const transferData = {
  account: '',
  recipient: '',
  quantity: '0.0001 EOS',
}

const generateTransaction = ({ account, recipient, quantity, memo = '' }) => ({
  actions: [{
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: account,
      permission: 'active',
    }],
    data: {
      from: account,
      to: recipient,
      quantity,
      memo,
    },
  }],
})

class TestApp extends Component {
  state = { message: '' }

  transfer = async () => {
    const { ual } = this.props
    try {
      const demoTransaction = generateTransaction(transferData)
      const result = await ual.activeUser.signTransaction(demoTransaction, { expireSeconds: 60, blocksBehind: 3 })
      this.setState({ message: `Transfer to ${transferData.to} Successful!` }, () => {
        setTimeout(this.resetMessage, 5000)
      })
      console.info('SUCCESS:', result)
    } catch (e) {
      console.error('ERROR:', e)
    }
  }

  resetMessage = () => this.setState({ message: '' })

  renderLoggedInView = () => (
    <>
      {!!this.state.message
        && (
          <div style={styles.announcementBar}>
            <p style={styles.baseText}>{this.state.message}</p>
          </div>
        )
      }
      <button onClick={this.transfer} style={[styles.button, styles.blueBG]}>
        <p style={styles.baseText}>{`Transfer 1 EOS to ${transferData.to}`}</p>
      </button>
      <button onClick={this.props.ual.logout} style={styles.logout}>
        <p>Logout</p>
      </button>
    </>
  )

  renderLoginButton = () => (
    <button onClick={this.props.ual.showModal} style={styles.button}>
      <p style={[styles.buttonText, styles.baseText]}>LOGIN</p>
    </button>
  )

  render() {
    const { ual: { activeAuthenticator } } = this.props
    return (
      <div style={styles.container}>
        {activeAuthenticator ? this.renderLoggedInView() : this.renderLoginButton()}
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  button: {
    paddingVertical: 40,
    paddingHorizontal: 80,
    backgroundColor: '#EA2E2E',
    textAlign: 'center',
    borderRadius: 5,
  },
  logout: {
    marginTop: 20,
  },
  baseText: {
    color: '#fff',
    fontSize: 18,
  },
  blueBG: {
    backgroundColor: '#447DD8',
  },
  announcementBar: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 20,
    textAlign: 'center',
    backgroundColor: '#3de13d',
    top: 0,
    position: 'absolute',
    alignItems: 'center',
  },
}

const exampleNet = { chainId, rpcEndpoints }

const TestAppConsumer = withUAL(TestApp)
const ledger = new Ledger([exampleNet])

const App = () => (
  <UALProvider chains={[exampleNet]} authenticators={[ledger]} appName='Authenticator Test App'>
    <TestAppConsumer />
  </UALProvider>
)

export default App
